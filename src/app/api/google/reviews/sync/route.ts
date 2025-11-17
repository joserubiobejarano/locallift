export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

import { resolveUser } from "@/lib/user-from-req";

import { googleFetch } from "@/lib/google";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { canUseReviewAutomation } from "@/lib/plan";
import { getUserPlan } from "@/lib/plan-server";

export async function POST(req: NextRequest) {
  const user = await resolveUser(req);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check plan gating
  const plan = await getUserPlan(user.id);
  if (!canUseReviewAutomation(plan)) {
    return NextResponse.json(
      { error: "Review automation is only available on paid plans" },
      { status: 403 }
    );
  }

  const { locationName } = await req.json();

  if (!locationName) {
    return NextResponse.json({ error: "locationName required" }, { status: 400 });
  }

  try {
    // fetch reviews
    const url = `https://mybusiness.googleapis.com/v4/${encodeURIComponent(locationName)}/reviews?pageSize=100`;

    const r = await googleFetch(user.id, url);

    if (!r.ok) {
      const t = await r.text();
      return NextResponse.json({ error: t }, { status: r.status });
    }

    const json = await r.json();

    // resolve local location id
    const admin = supabaseAdmin();

    const { data: loc } = await admin
      .from("gbp_locations")
      .select("id")
      .eq("user_id", user.id)
      .eq("location_name", locationName)
      .maybeSingle();

    if (!loc) {
      return NextResponse.json({ error: "Location not found locally" }, { status: 404 });
    }

    const rows = (json.reviews ?? []).map((rv: any) => ({
      user_id: user.id,
      location_id: loc.id,
      google_review_id: rv.reviewId,
      reviewer_name: rv.reviewer?.displayName ?? null,
      star_rating: rv.starRating ? Number(rv.starRating) : null,
      comment: rv.comment ?? null,
      review_update_time: rv.updateTime ? new Date(rv.updateTime).toISOString() : null,
      language_code: rv.reviewReply?.languageCode ?? null,
      reply_comment: rv.reviewReply?.comment ?? null,
      reply_update_time: rv.reviewReply?.updateTime ? new Date(rv.reviewReply.updateTime).toISOString() : null,
      status: rv.reviewReply?.comment ? "replied" : "new",
      updated_at: new Date().toISOString(),
    }));

    if (rows.length) {
      const { error } = await admin.from("reviews").upsert(rows, {
        onConflict: "user_id,google_review_id",
      });
      if (error) throw error;
    }

    return NextResponse.json({ imported: rows.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


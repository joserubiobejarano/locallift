export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

import { resolveUser } from "@/lib/user-from-req";

import { googleFetch } from "@/lib/google";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const user = await resolveUser(req);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reviewId, locationName, reply } = await req.json();

  if (!reviewId || !locationName || !reply) {
    return NextResponse.json({ error: "reviewId, locationName, reply required" }, { status: 400 });
  }

  try {
    // GBP v4: setReply endpoint
    const url = `https://mybusiness.googleapis.com/v4/${encodeURIComponent(locationName)}/reviews/${encodeURIComponent(reviewId)}:updateReply`;

    const r = await googleFetch(user.id, url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: { comment: reply } }),
    });

    if (!r.ok) {
      const t = await r.text();
      return NextResponse.json({ error: t }, { status: r.status });
    }

    const admin = supabaseAdmin();

    // find local review
    const { data: review } = await admin
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("google_review_id", reviewId)
      .maybeSingle();

    if (review) {
      await admin.from("review_replies").insert({
        user_id: user.id,
        review_id: review.id,
        draft_markdown: reply,
        posted: true,
        posted_at: new Date().toISOString(),
      });

      await admin
        .from("reviews")
        .update({ status: "replied", reply_comment: reply, reply_update_time: new Date().toISOString() })
        .eq("id", review.id);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


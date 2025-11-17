export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

import { resolveUser } from "@/lib/user-from-req";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {

  const user = await resolveUser(req);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const loc = new URL(req.url).searchParams.get("loc");

  if (!loc) return NextResponse.json({ items: [] });

  const admin = supabaseAdmin();

  const { data, error } = await admin

    .from("reviews")

    .select("google_review_id, reviewer_name, star_rating, comment, status")

    .eq("user_id", user.id)

    .eq("location_name", loc)

    .order("review_update_time", { ascending: false })

    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ items: data ?? [] });

}


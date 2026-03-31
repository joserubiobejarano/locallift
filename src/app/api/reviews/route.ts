export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

import { resolveUser } from "@/lib/user-from-req";
import { sql } from "@/lib/db/neon";

export async function GET(req: NextRequest) {
  const user = await resolveUser(req);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const loc = new URL(req.url).searchParams.get("loc");

  if (!loc) return NextResponse.json({ items: [] });

  const rows = await sql`
    SELECT google_review_id, reviewer_name, star_rating, comment, status
    FROM public.reviews
    WHERE user_id = ${user.id}
      AND location_name = ${loc}
    ORDER BY review_update_time DESC NULLS LAST
    LIMIT 100
  `;

  return NextResponse.json({ items: rows });
}

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

import { resolveUser } from "@/lib/user-from-req";

import { googleFetch } from "@/lib/google";

import { sql } from "@/lib/db/neon";
import { canUseReviewAutomation } from "@/lib/plan";
import { getUserPlan } from "@/lib/plan-server";

export async function POST(req: NextRequest) {
  const isDemo = req.headers.get("x-demo") === "true";

  if (isDemo) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json({ ok: true });
  }

  const user = await resolveUser(req);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!canUseReviewAutomation(plan)) {
    return NextResponse.json(
      { error: "Posting replies to Google is only available on paid plans" },
      { status: 403 }
    );
  }

  const { reviewId, locationName, reply } = await req.json();

  if (!reviewId || !locationName || !reply) {
    return NextResponse.json({ error: "reviewId, locationName, reply required" }, { status: 400 });
  }

  try {
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

    const reviewRows = await sql`
      SELECT id FROM public.reviews
      WHERE user_id = ${user.id}
        AND google_review_id = ${reviewId}
      LIMIT 1
    `;

    const review = reviewRows[0] as { id: string } | undefined;

    if (review) {
      await sql`
        INSERT INTO public.review_replies (
          user_id, review_id, draft_markdown, posted, posted_at
        ) VALUES (
          ${user.id},
          ${review.id},
          ${reply},
          true,
          ${new Date().toISOString()}
        )
      `;

      await sql`
        UPDATE public.reviews
        SET
          status = 'replied',
          reply_comment = ${reply},
          reply_update_time = ${new Date().toISOString()},
          updated_at = now()
        WHERE id = ${review.id}
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

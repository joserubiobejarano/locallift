export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { resolveUser } from "@/lib/user-from-req";
import { sql } from "@/lib/db/neon";
import { canUseReviewAutomation } from "@/lib/plan";
import { getUserPlan } from "@/lib/plan-server";
import { getProfileReplyDefaults } from "@/lib/reply-profile-defaults";
import {
  generateReplyForReviewRow,
  persistReplyPostedLocally,
  saveReplyDraft,
  type ReviewRowForReply,
} from "@/lib/review-reply-server";

const BodySchema = z.object({
  locationName: z.string().min(1),
});

const MAX_BATCH = 40;

export async function POST(req: NextRequest) {
  const isDemo = req.headers.get("x-demo") === "true";
  if (isDemo) {
    return NextResponse.json({
      processed: 0,
      posted: 0,
      drafted: 0,
      skipped: 0,
      autoHandled: 0,
      errors: [],
    });
  }

  const user = await resolveUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const message = first ? `${first.path.join(".")}: ${first.message}` : "Invalid input";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { locationName } = parsed.data;

  const profile = await getProfileReplyDefaults(user.id);
  const autoReply = profile?.auto_reply_all_reviews === true;
  const plan = await getUserPlan(user.id);
  const canPost = canUseReviewAutomation(plan);

  const rows = (await sql`
    SELECT id, google_review_id, comment, star_rating
    FROM public.reviews
    WHERE user_id = ${user.id}
      AND location_name = ${locationName}
      AND (status IS NULL OR lower(status) <> 'replied')
    ORDER BY review_update_time DESC NULLS LAST
    LIMIT ${MAX_BATCH}
  `) as ReviewRowForReply[];

  let posted = 0;
  let drafted = 0;
  let autoHandled = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const text = (row.comment ?? "").trim();
    if (!text) {
      skipped += 1;
      continue;
    }

    try {
      const reply = await generateReplyForReviewRow(row, profile);
      if (!reply.trim()) {
        skipped += 1;
        continue;
      }

      /** MVP: auto-reply simulates “posted” in-app only (no Google API on sync). */
      const shouldSimulateAutoPost = autoReply && canPost;
      if (shouldSimulateAutoPost) {
        const res = await persistReplyPostedLocally(user.id, row.google_review_id, reply);
        if (res.ok) {
          autoHandled += 1;
        } else {
          errors.push(`${row.google_review_id}: ${res.error}`);
          const draftRes = await saveReplyDraft(user.id, row.google_review_id, reply);
          if (draftRes.ok) drafted += 1;
        }
      } else {
        const draftRes = await saveReplyDraft(user.id, row.google_review_id, reply);
        if (draftRes.ok) {
          drafted += 1;
        } else {
          errors.push(`${row.google_review_id}: ${draftRes.error}`);
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      errors.push(`${row.google_review_id}: ${msg}`);
    }
  }

  return NextResponse.json({
    processed: rows.length,
    posted,
    drafted,
    autoHandled,
    skipped,
    errors,
  });
}

import { NextResponse } from "next/server";
import { z } from "zod";

import { generateReviewReply } from "@/lib/openai";
import { resolveUser } from "@/lib/user-from-req";

const Schema = z.object({
  businessName: z.string().min(1),
  city: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1),
});

export async function POST(req: Request) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json();
  const parsed = Schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const markdown = await generateReviewReply(parsed.data);

  return NextResponse.json({ reply: markdown });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


import { NextResponse } from "next/server";
import { z } from "zod";

import { generateBlog, generateGBPPost, generateFAQs } from "@/lib/openai";
import { resolveUser } from "@/lib/user-from-req";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const InputSchema = z.object({
  type: z.enum(["blog", "gbp_post", "faq"]),
  businessName: z.string().min(1),
  city: z.string().min(1),
  service: z.string().min(1),
  tone: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const user = await resolveUser(req);

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const json = await req.json();
    const parsed = InputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { type, ...rest } = parsed.data;
    let markdown = "";

    if (type === "blog") markdown = await generateBlog(rest);
    if (type === "gbp_post") markdown = await generateGBPPost(rest);
    if (type === "faq") markdown = await generateFAQs(rest);

    return NextResponse.json({ markdown });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
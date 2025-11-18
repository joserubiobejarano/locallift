import { NextResponse } from "next/server";
import { z } from "zod";

import { resolveUser } from "@/lib/user-from-req";
import { generateLocalBlogPost, generateLocalGBPPost, generateLocalFAQs } from "@/lib/agents/localSeoAgent";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";

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

    // Check usage limits
    const usage = await checkUsageLimit(user.id, "ai_posts");
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: "Monthly limit reached",
          message: `You've reached your monthly limit of ${usage.limit} Local SEO posts. Your usage will reset on ${usage.resetDate || "the next billing cycle"}.`,
        },
        { status: 403 }
      );
    }

    const json = await req.json();
    const parsed = InputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { type, service, ...rest } = parsed.data;
    let markdown = "";

    // Use local SEO agent with category from service field
    const input = {
      ...rest,
      category: service,
    };

    if (type === "blog") markdown = await generateLocalBlogPost(input);
    if (type === "gbp_post") markdown = await generateLocalGBPPost(input);
    if (type === "faq") markdown = await generateLocalFAQs(input);

    // Increment usage after successful generation
    await incrementUsage(user.id, "ai_posts");

    return NextResponse.json({ markdown });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
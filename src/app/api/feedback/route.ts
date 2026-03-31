import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { sql } from "@/lib/db/neon";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { message, category, url, browser } = body ?? {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await sql`
      INSERT INTO public.feedback (user_id, message, category, url, browser)
      VALUES (
        ${session?.user?.id ?? null},
        ${message.trim()},
        ${category ?? null},
        ${url ?? null},
        ${browser ?? null}
      )
    `;

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error";
    console.error("[feedback]", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

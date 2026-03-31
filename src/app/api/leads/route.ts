export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, query_text, audit_result, user_agent } = body;

    if (!email || !query_text) {
      return NextResponse.json(
        { error: "Email and query_text are required" },
        { status: 400 }
      );
    }

    const auditText =
      typeof audit_result === "string"
        ? audit_result
        : audit_result
          ? JSON.stringify(audit_result)
          : "";

    await sql`
      INSERT INTO public.leads (
        email, business_query, audit_text
      ) VALUES (
        ${email},
        ${query_text},
        ${auditText || "(no audit text)"}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[leads] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

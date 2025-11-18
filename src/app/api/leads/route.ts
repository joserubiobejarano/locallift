export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

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

    const admin = supabaseAdmin();

    const { error } = await admin.from("leads").insert({
      email,
      query_text,
      audit_result,
      user_agent: user_agent || req.headers.get("user-agent") || null,
    });

    if (error) {
      console.error("[leads] insert error:", error);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[leads] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


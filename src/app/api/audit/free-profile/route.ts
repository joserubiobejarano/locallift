export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateProfileAudit, type ProfileAuditInput } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessQuery, city, category, email } = body;

    // Validate required fields
    if (!businessQuery || !email || !businessQuery.trim() || !email.trim()) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare input for generateProfileAudit
    const input: ProfileAuditInput = {
      mode: "quick",
      businessName: null,
      city: city || null,
      category: category || null,
      urlOrName: businessQuery,
      gbpData: null,
    };

    // Generate audit using OpenAI
    const auditText = await generateProfileAudit(input);

    // Extract score from markdown using regex
    // Look for patterns like "Score: 78/100" or "scores 78/100"
    const scoreMatch = auditText.match(/(?:score|scores):?\s+(\d{1,3})\/100/i);
    let score: number | null = null;
    
    if (scoreMatch) {
      const parsedScore = parseInt(scoreMatch[1], 10);
      // Clamp between 0 and 100
      score = Math.max(0, Math.min(100, parsedScore));
    }

    // Insert lead into database using admin client
    const admin = supabaseAdmin();
    const { error: insertError } = await admin.from("leads").insert({
      email: email.trim(),
      business_query: businessQuery.trim(),
      city: city?.trim() || null,
      category: category?.trim() || null,
      audit_text: auditText,
      score,
    });

    if (insertError) {
      console.error("[free-audit] insert error:", insertError);
      // Don't fail the request if insert fails, but log it
      // We still want to return the audit to the user
    }

    return NextResponse.json({
      ok: true,
      auditText,
      score,
    });
  } catch (err: any) {
    console.error("[free-audit] error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong, please try again.",
      },
      { status: 500 }
    );
  }
}


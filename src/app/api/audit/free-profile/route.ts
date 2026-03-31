export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";
import { generateProfileAudit, type ProfileAuditInput } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessQuery, city, category, email } = body;

    if (!businessQuery || !email || !businessQuery.trim() || !email.trim()) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const input: ProfileAuditInput = {
      mode: "quick",
      businessName: null,
      city: city || null,
      category: category || null,
      urlOrName: businessQuery,
      gbpData: null,
    };

    const auditText = await generateProfileAudit(input);

    const scoreMatch = auditText.match(/(?:score|scores):?\s+(\d{1,3})\/100/i);
    let score: number | null = null;

    if (scoreMatch) {
      const parsedScore = parseInt(scoreMatch[1], 10);
      score = Math.max(0, Math.min(100, parsedScore));
    }

    try {
      await sql`
        INSERT INTO public.leads (
          email, business_query, city, category, audit_text, score
        ) VALUES (
          ${email.trim()},
          ${businessQuery.trim()},
          ${city?.trim() || null},
          ${category?.trim() || null},
          ${auditText},
          ${score}
        )
      `;
    } catch (insertErr) {
      console.error("[free-audit] insert error:", insertErr);
    }

    return NextResponse.json({
      ok: true,
      auditText,
      score,
    });
  } catch (err: unknown) {
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

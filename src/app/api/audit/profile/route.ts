export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

import { resolveUser } from "@/lib/user-from-req";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  generateProfileAudit,
  type ProfileAuditInput,
} from "@/lib/openai";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";

export async function POST(req: NextRequest) {
  try {
    let user = null;

    try {
      user = await resolveUser(req);
    } catch (err) {
      console.error("[audit] resolveUser error", err);
    }

    const body = await req.json();
    const { mode, locationId, urlOrName, city, category } = body;

    if (mode !== "connected" && mode !== "quick") {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    // Auth rules: connected mode requires user, quick mode does not
    if (mode === "connected" && !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check usage limits for connected mode (quick mode is free via /free-audit)
    if (mode === "connected" && user) {
      const usage = await checkUsageLimit(user.id, "audits");
      if (!usage.allowed) {
        return NextResponse.json(
          {
            error: "Monthly limit reached",
            message: `You've reached your monthly limit of ${usage.limit} full audits. Your usage will reset on ${usage.resetDate || "the next billing cycle"}.`,
          },
          { status: 403 }
        );
      }
    }

    let input: ProfileAuditInput;

    if (mode === "connected") {
      if (!locationId) {
        return NextResponse.json(
          { error: "Missing locationId" },
          { status: 400 }
        );
      }

      const admin = supabaseAdmin();
      const { data: location, error: locationError } = await admin
        .from("gbp_locations")
        .select("*")
        .eq("id", locationId)
        .eq("user_id", user!.id)
        .maybeSingle();

      if (locationError) {
        console.error("[audit] location fetch error", locationError);
        return NextResponse.json(
          { error: "Failed to fetch location" },
          { status: 500 }
        );
      }

      if (!location) {
        return NextResponse.json(
          { error: "Location not found" },
          { status: 404 }
        );
      }

      // Extract business name from title or raw data
      const businessName =
        location.title ||
        (location.raw as any)?.title ||
        (location.raw as any)?.storefront?.title ||
        null;

      // Extract city from address or raw data
      const extractedCity =
        city ||
        (location.raw as any)?.storefront?.address?.locality ||
        (location.raw as any)?.address?.locality ||
        null;

      // Extract category from raw data
      const extractedCategory =
        category ||
        (location.raw as any)?.storefront?.primaryCategoryId ||
        (location.raw as any)?.primaryCategoryId ||
        null;

      input = {
        mode: "connected",
        businessName,
        city: extractedCity,
        category: extractedCategory,
        urlOrName: location.location_id || null,
        gbpData: location,
      };
    } else {
      // mode === "quick"
      if (!urlOrName) {
        return NextResponse.json(
          { error: "Missing urlOrName" },
          { status: 400 }
        );
      }

      input = {
        mode: "quick",
        businessName: null,
        city: city || null,
        category: category || null,
        urlOrName,
        gbpData: null,
      };
    }

    const markdown = await generateProfileAudit(input);

    // Increment usage for connected mode
    if (mode === "connected" && user) {
      await incrementUsage(user.id, "audits");
    }

    return NextResponse.json({ markdown });
  } catch (err: any) {
    console.error("[audit] error", err);
    return NextResponse.json(
      { error: "Failed to generate audit" },
      { status: 500 }
    );
  }
}


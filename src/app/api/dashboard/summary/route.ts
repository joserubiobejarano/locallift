export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { resolveUser } from "@/lib/user-from-req";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  try {
    const user = await resolveUser(req);
    if (!user) {
      console.warn("[dashboard.summary] unauthorized request");
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const supabase = supabaseAdmin();

    // Count projects
    const { count: projectsCount, error: projectsError } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (projectsError) {
      console.error("[dashboard.summary] error counting projects:", projectsError);
      throw projectsError;
    }

    // Count reviews
    const { count: reviewsCount, error: reviewsError } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (reviewsError) {
      console.error("[dashboard.summary] error counting reviews:", reviewsError);
      throw reviewsError;
    }

    // Count GBP locations
    const { count: locationsCount, error: locationsError } = await supabase
      .from("gbp_locations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (locationsError) {
      console.error("[dashboard.summary] error counting locations:", locationsError);
      throw locationsError;
    }

    return NextResponse.json({
      projectsCount: projectsCount ?? 0,
      reviewsCount: reviewsCount ?? 0,
      locationsCount: locationsCount ?? 0,
    });
  } catch (e: any) {
    console.error("[dashboard.summary] error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


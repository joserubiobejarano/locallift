export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { googleAuthUrl } from "@/lib/google";
import { resolveUser } from "@/lib/user-from-req";
import { getServerAppUrl } from "@/lib/env";
import { canUseGoogleConnection } from "@/lib/plan";
import { getUserPlan } from "@/lib/plan-server";

export async function GET(req: Request) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.redirect(new URL("/login", getServerAppUrl()));

  // Check plan gating
  const plan = await getUserPlan(user.id);
  if (!canUseGoogleConnection(plan)) {
    return NextResponse.json(
      { error: "Google connection is only available on paid plans" },
      { status: 403 }
    );
  }

  const state = user.id;
  const url = googleAuthUrl(state);
  console.log("[GBP OAuth] redirect:", url);

  const u = new URL(req.url);
  if (u.searchParams.get("debug") === "1") {
    return NextResponse.json({ redirect: url });
  }

  return NextResponse.redirect(url, { status: 302 });
}


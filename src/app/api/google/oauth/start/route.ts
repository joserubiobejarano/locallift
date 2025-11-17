export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { googleAuthUrl } from "@/lib/google";
import { resolveUser } from "@/lib/user-from-req";
import { getServerAppUrl } from "@/lib/env";

export async function GET(req: Request) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.redirect(new URL("/login", getServerAppUrl()));

  const state = user.id;
  const url = googleAuthUrl(state);
  console.log("[GBP OAuth] redirect:", url);

  const u = new URL(req.url);
  if (u.searchParams.get("debug") === "1") {
    return NextResponse.json({ redirect: url });
  }

  return NextResponse.redirect(url, { status: 302 });
}


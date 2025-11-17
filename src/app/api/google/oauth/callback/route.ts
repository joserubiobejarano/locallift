export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { exchangeCodeForTokens } from "@/lib/google";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getServerAppUrl } from "@/lib/env";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return new NextResponse("Missing code/state", { status: 400 });

  const tokens = await exchangeCodeForTokens(code);

  const userId = state;

  const admin = supabaseAdmin();

  const { error } = await admin.rpc("upsert_gbp_connection", {
    p_user_id: userId,
    p_access_token: tokens.access_token,
    p_refresh_token: tokens.refresh_token ?? "",
    p_expires_at: new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000).toISOString(),
    p_scope: tokens.scope ?? null,
  });

  if (error) {
    return new Response(`DB error: ${error.message}`, { status: 500 });
  }

  return NextResponse.redirect(new URL("/settings?google=connected", getServerAppUrl()), { status: 302 });
}


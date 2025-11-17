export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { gbpFetch, refreshAccessToken } from "@/lib/google";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resolveUser } from "@/lib/user-from-req";

export async function POST(req: Request) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = supabaseAdmin();
  const { data: conn, error: connError } = await admin
    .from("gbp_connections")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (connError) return NextResponse.json({ error: connError.message }, { status: 500 });
  if (!conn) return NextResponse.json({ error: "Not connected to Google" }, { status: 400 });

  let accessToken = conn.access_token as string;

  if (conn.expires_at && new Date(conn.expires_at) < new Date()) {
    const refreshed = await refreshAccessToken(conn.refresh_token as string);
    accessToken = refreshed.access_token;

    await admin
      .from("gbp_connections")
      .update({
        access_token: accessToken,
        expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
  }

  const accounts = await gbpFetch(`/accounts`, accessToken);
  const upserts: Record<string, unknown>[] = [];

  for (const acc of accounts.accounts || []) {
    const accId = acc.name as string;
    const locs = await gbpFetch(`/${accId}/locations`, accessToken);

    for (const loc of locs.locations || []) {
      upserts.push({
        user_id: user.id,
        location_id: loc.name,
        title: loc.title ?? null,
        address: loc.storefrontAddress ? JSON.stringify(loc.storefrontAddress) : null,
        timezone: loc.timezone ?? null,
        raw: loc,
        updated_at: new Date().toISOString(),
      });
    }
  }

  if (upserts.length) {
    const { error } = await admin.from("gbp_locations").upsert(upserts, { onConflict: "user_id,location_id" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: latest, error: latestError } = await admin
    .from("gbp_locations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (latestError) return NextResponse.json({ error: latestError.message }, { status: 500 });

  return NextResponse.json({ locations: latest || [] });
}


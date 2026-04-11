export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { gbpFetch, refreshAccessToken } from "@/lib/google";
import { sql } from "@/lib/db/neon";
import { updateGbpTokens } from "@/lib/db/gbp";
import { resolveUser } from "@/lib/user-from-req";
import { demoLocations } from "@/lib/demo-data";
import { getUserPlan } from "@/lib/plan-server";
import { canUseGoogleConnection } from "@/lib/plan";

type ConnRow = {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  scope: string | null;
};

export async function POST(req: Request) {
  const isDemo = req.headers.get("x-demo") === "true";

  if (isDemo) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return NextResponse.json({ locations: demoLocations });
  }

  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!canUseGoogleConnection(plan)) {
    return NextResponse.json({ error: "Google Business Profile access requires a paid plan" }, { status: 403 });
  }

  const connRows = await sql`
    SELECT access_token, refresh_token, expires_at, scope
    FROM public.gbp_connections
    WHERE user_id = ${user.id}
    LIMIT 1
  `;

  const conn = connRows[0] as ConnRow | undefined;
  if (!conn) {
    return NextResponse.json(
      { error: "Google connection failed. Please try again." },
      { status: 400 }
    );
  }

  let accessToken = conn.access_token;

  if (conn.expires_at && new Date(conn.expires_at) < new Date()) {
    const refreshed = await refreshAccessToken(conn.refresh_token);
    accessToken = refreshed.access_token;
    const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
    await updateGbpTokens({
      userId: user.id,
      accessToken,
      refreshToken: conn.refresh_token,
      expiresAt,
      scope: refreshed.scope ?? conn.scope,
    });
  }

  const accounts = await gbpFetch(`/accounts`, accessToken);
  const accountList = (accounts as { accounts?: { name: string }[] }).accounts || [];
  if (!accountList.length) {
    return NextResponse.json({ error: "No locations were found for this account." }, { status: 404 });
  }

  let importedCount = 0;
  for (const acc of accountList) {
    const accId = acc.name;
    const locs = await gbpFetch(`/${accId}/locations`, accessToken);

    for (const loc of (locs as { locations?: Record<string, unknown>[] }).locations || []) {
      const locName = loc.name as string;
      const title = (loc.title as string) ?? null;
      const address = loc.storefrontAddress ? JSON.stringify(loc.storefrontAddress) : null;
      const timezone = (loc.timezone as string) ?? null;
      const now = new Date().toISOString();

      await sql`
        INSERT INTO public.gbp_locations (
          user_id, location_name, title, address, timezone, raw, updated_at
        ) VALUES (
          ${user.id},
          ${locName},
          ${title},
          ${address},
          ${timezone},
          ${loc as unknown},
          ${now}
        )
        ON CONFLICT (user_id, location_name) DO UPDATE SET
          title = EXCLUDED.title,
          address = EXCLUDED.address,
          timezone = EXCLUDED.timezone,
          raw = EXCLUDED.raw,
          updated_at = EXCLUDED.updated_at
      `;
      importedCount += 1;
    }
  }

  if (importedCount === 0) {
    return NextResponse.json({ error: "No locations were found for this account." }, { status: 404 });
  }

  const latest = await sql`
    SELECT *
    FROM public.gbp_locations
    WHERE user_id = ${user.id}
    ORDER BY updated_at DESC
  `;

  return NextResponse.json({ locations: latest, imported: importedCount });
}

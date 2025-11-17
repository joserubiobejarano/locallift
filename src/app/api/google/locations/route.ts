export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

import { resolveUser } from "@/lib/user-from-req";

import { googleFetch } from "@/lib/google";

import { supabaseAdmin } from "@/lib/supabase/admin";

const LIST_URL =
  "https://mybusinessbusinessinformation.googleapis.com/v1/locations?pageSize=100&readMask=name,title,storeCode,placeId";

export async function GET(req: NextRequest) {
  const user = await resolveUser(req);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const r = await googleFetch(user.id, LIST_URL);

    if (!r.ok) {
      const t = await r.text();
      return NextResponse.json({ error: t }, { status: r.status });
    }

    const json = await r.json();

    // upsert minimal gbp_locations for convenience
    const admin = supabaseAdmin();

    const upserts = (json.locations ?? []).map((loc: any) => ({
      user_id: user.id,
      location_name: loc.name,
      title: loc.title ?? null,
      store_code: loc.storeCode ?? null,
      place_id: loc.placeId ?? null,
      updated_at: new Date().toISOString(),
    }));

    if (upserts.length) {
      const { error } = await admin.from("gbp_locations").upsert(upserts, {
        onConflict: "user_id,location_name",
      });
      if (error) console.error("[locations.upsert]", error);
    }

    return NextResponse.json({ locations: json.locations ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


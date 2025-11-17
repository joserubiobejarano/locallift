export const runtime = "nodejs";

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { resolveUser } from "@/lib/user-from-req";
import { supabaseAsUser } from "@/lib/supabase/as-user";

function getBearer(req: Request) {
  const h = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!h) return null;
  const p = h.trim().split(" ");
  return p.length === 2 && p[0].toLowerCase() === "bearer" ? p[1] : null;
}

export async function GET(req: Request) {
  try {
    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = getBearer(req);
    const db = token ? supabaseAsUser(token) : supabaseAsUser(""); // if no token, RLS will fail (401 above)
    const { data, error } = await db
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ projects: data ?? [] });
  } catch (e: any) {
    console.error("[projects.GET] error:", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, type, input, output_md } = body ?? {};

    if (!title || !type || !input) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const token = getBearer(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const db = supabaseAsUser(token);
    const { data, error } = await db
      .from("projects")
      .insert({
        user_id: user.id,
        title,
        type,
        input,
        output_md: output_md ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data });
  } catch (e: any) {
    console.error("[projects.POST] error:", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}

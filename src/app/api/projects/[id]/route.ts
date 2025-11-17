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

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = getBearer(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const db = supabaseAsUser(token);
    const { data, error } = await db
      .from("projects")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data });
  } catch (e: any) {
    console.error("[projects.id.GET] error:", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, output_md } = body ?? {};

    const token = getBearer(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const db = supabaseAsUser(token);
    const { data, error } = await db
      .from("projects")
      .update({ title, output_md, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data });
  } catch (e: any) {
    console.error("[projects.id.PUT] error:", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = getBearer(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const db = supabaseAsUser(token);
    const { error } = await db
      .from("projects")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[projects.id.DELETE] error:", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}

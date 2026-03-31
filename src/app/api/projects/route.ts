export const runtime = "nodejs";

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { resolveUser } from "@/lib/user-from-req";
import { sql } from "@/lib/db/neon";
import { demoProjects } from "@/lib/demo-data";

export async function GET(req: Request) {
  try {
    const isDemo = req.headers.get("x-demo") === "true";

    if (isDemo) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json({ projects: demoProjects });
    }

    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await sql`
      SELECT *
      FROM public.projects
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ projects: data ?? [] });
  } catch (e: unknown) {
    console.error("[projects.GET] error:", e);
    return NextResponse.json({ error: (e as Error).message ?? "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isDemo = req.headers.get("x-demo") === "true";

    if (isDemo) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const body = await req.json();
      const mockProject = {
        id: "demo-new-project-" + Date.now(),
        user_id: "demo-user",
        title: body.title || "Demo Project",
        type: body.type || "blog",
        input: body.input || {},
        output_md: body.output_md || "",
        created_at: new Date().toISOString(),
      };
      return NextResponse.json({ project: mockProject });
    }

    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, type, input, output_md } = body ?? {};

    if (!title || !type || !input) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO public.projects (user_id, title, type, input, output_md)
      VALUES (
        ${user.id},
        ${title},
        ${type},
        ${input as object},
        ${output_md ?? null}
      )
      RETURNING *
    `;

    const data = rows[0];
    return NextResponse.json({ project: data });
  } catch (e: unknown) {
    console.error("[projects.POST] error:", e);
    return NextResponse.json({ error: (e as Error).message ?? "Server error" }, { status: 500 });
  }
}

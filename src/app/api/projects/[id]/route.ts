export const runtime = "nodejs";

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { resolveUser } from "@/lib/user-from-req";
import { sql } from "@/lib/db/neon";
import { demoProjects } from "@/lib/demo-data";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isDemo = req.headers.get("x-demo") === "true";

    if (isDemo) {
      const { id } = await params;
      const project = demoProjects.find((p) => p.id === id);
      if (project) {
        return NextResponse.json({ project });
      }
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const rows = await sql`
      SELECT * FROM public.projects
      WHERE id = ${id}
        AND user_id = ${user.id}
      LIMIT 1
    `;

    const data = rows[0];
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ project: data });
  } catch (e: unknown) {
    console.error("[projects.id.GET] error:", e);
    return NextResponse.json({ error: (e as Error).message ?? "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isDemo = req.headers.get("x-demo") === "true";

    if (isDemo) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { id } = await params;
      const body = await req.json();
      const project = demoProjects.find((p) => p.id === id);

      if (project) {
        return NextResponse.json({
          project: {
            ...project,
            title: body.title || project.title,
            output_md: body.output_md || project.output_md,
            updated_at: new Date().toISOString(),
          },
        });
      }

      return NextResponse.json({
        project: {
          id,
          user_id: "demo-user",
          title: body.title || "Demo Project",
          output_md: body.output_md || "",
          updated_at: new Date().toISOString(),
        },
      });
    }

    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { title, output_md } = body ?? {};

    const rows = await sql`
      UPDATE public.projects
      SET
        title = COALESCE(${title ?? null}, title),
        output_md = COALESCE(${output_md ?? null}, output_md),
        updated_at = now()
      WHERE id = ${id}
        AND user_id = ${user.id}
      RETURNING *
    `;

    const data = rows[0];
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ project: data });
  } catch (e: unknown) {
    console.error("[projects.id.PUT] error:", e);
    return NextResponse.json({ error: (e as Error).message ?? "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isDemo = req.headers.get("x-demo") === "true";

    if (isDemo) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json({ ok: true });
    }

    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await sql`
      DELETE FROM public.projects
      WHERE id = ${id}
        AND user_id = ${user.id}
    `;

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("[projects.id.DELETE] error:", e);
    return NextResponse.json({ error: (e as Error).message ?? "Server error" }, { status: 500 });
  }
}

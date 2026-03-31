import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getUserPlanInfo } from "@/lib/plan-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const planInfo = await getUserPlanInfo(session.user.id);
    return NextResponse.json(planInfo);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Server error";
    console.error("[user/plan]", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

/** Clear demo cookie; session cookies are cleared by next-auth `signOut()` on the client. */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("ll_demo", "", { path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}

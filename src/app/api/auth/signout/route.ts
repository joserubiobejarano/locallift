export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseFromRequest } from "@/lib/supabase/route";

export async function POST(req: NextRequest) {
  const { supabase } = supabaseFromRequest(req);

  await supabase.auth.signOut();

  const cookieStore = await cookies();

  // Clear Supabase auth cookies
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");

  return NextResponse.json({ ok: true });
}



export const runtime = "nodejs";

import { NextRequest } from "next/server";

import { supabaseFromRequest } from "@/lib/supabase/route";

export async function POST(req: NextRequest) {
  const { supabase, res } = supabaseFromRequest(req);

  try {
    const { access_token, refresh_token } = await req.json();

    if (!access_token || !refresh_token) {
      return new Response(JSON.stringify({ ok: false, error: "Missing tokens" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const { error } = await supabase.auth.setSession({ access_token, refresh_token });

    // If cookies are already set, Supabase may report the refresh token was already used.
    // Treat that as success because the session is already active in cookies.
    if (error) {
      const msg = (error as any)?.message || "";
      const code = (error as any)?.code || "";
      const already =
        code === "refresh_token_already_used" ||
        /already used/i.test(msg) ||
        /Invalid Refresh Token/i.test(msg);

      if (!already) {
        return new Response(JSON.stringify({ ok: false, error: msg || "setSession failed" }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json", "x-idempotent": "1" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "Unexpected error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}



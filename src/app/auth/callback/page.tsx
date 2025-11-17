"use client";

import { useEffect, useRef } from "react";

import { supabaseBrowser } from "@/lib/supabase/client";

export default function AuthCallback() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        // Prevent duplicate runs across reloads/HMR
        if (typeof window !== "undefined" && sessionStorage.getItem("oauth_sync_done") === "1") {
          window.location.href = "/content";
          return;
        }

        const supabase = supabaseBrowser();
        const { data } = await supabase.auth.getSession();
        const session = data?.session;

        if (session?.access_token && session?.refresh_token) {
          const res = await fetch("/api/auth/set", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            }),
          });

          // Even if the backend says token was already used, it now returns 200
          if (res.ok && typeof window !== "undefined") {
            sessionStorage.setItem("oauth_sync_done", "1");
            window.location.href = "/content";
            return;
          }
        }

        window.location.href = "/login?error=callback";
      } catch {
        window.location.href = "/login?error=callback";
      }
    })();
  }, []);

  return <p className="text-sm text-muted-foreground p-6">Finishing sign in…</p>;
}



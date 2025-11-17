"use client";

import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignOutButton() {
  async function signOut() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <Button variant="secondary" onClick={signOut}>
      Sign out
    </Button>
  );
}


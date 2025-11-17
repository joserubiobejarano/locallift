"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/client";

export function CTAButton() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabaseBrowser()
      .auth.getSession()
      .then(({ data }) => {
        setIsLoggedIn(!!data.session);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  if (isLoggedIn === null) {
    return (
      <Button size="lg" asChild>
        <Link href="/signup">Start free</Link>
      </Button>
    );
  }

  return (
    <Button size="lg" asChild>
      <Link href={isLoggedIn ? "/content" : "/signup"}>
        {isLoggedIn ? "Go to dashboard" : "Start free"}
      </Link>
    </Button>
  );
}

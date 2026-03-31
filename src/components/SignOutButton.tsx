"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SignOutButton({ className }: { className?: string }) {
  async function signOutHandler() {
    await fetch("/api/auth/signout", { method: "POST" });
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <Button variant="secondary" className={cn(className)} onClick={signOutHandler}>
      Sign out
    </Button>
  );
}

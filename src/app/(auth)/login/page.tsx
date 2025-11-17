"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { getAppUrl } from "@/lib/env";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isDemo = searchParams?.get("demo") === "1";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !data.session) {
        toast.error(sessionError?.message || "No session");
        return;
      }

      await fetch("/api/auth/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }),
      });

      const redirectUrl = isDemo ? "/content?demo=1" : "/content";
      window.location.href = redirectUrl;
    }
  }

  async function signInWithGoogle() {
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getAppUrl()}/auth/callback`,
        queryParams: { prompt: "consent" },
      },
    });

    if (error) alert(error.message);
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-semibold">Log in</h1>
        <Button
          type="button"
          variant="secondary"
          onClick={signInWithGoogle}
          className="w-full"
        >
          Continue with Google
        </Button>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Log in
        </Button>
        <p className="text-sm text-muted-foreground">
          No account?{" "}
          <Link className="underline" href="/signup">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-3">
          <h1 className="text-2xl font-semibold">Log in</h1>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}


"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { safeRelativeRedirect } from "@/lib/safe-redirect";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const callbackParam = searchParams?.get("callbackUrl") ?? undefined;
  const afterLoginUrl = safeRelativeRedirect(callbackParam, "/dashboard");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error || "Could not sign in");
      return;
    }

    window.location.href = afterLoginUrl;
  }

  async function signInWithGoogle() {
    await signIn("google", {
      callbackUrl: afterLoginUrl,
    });
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

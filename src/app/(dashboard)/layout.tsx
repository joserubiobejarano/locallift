"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import SignOutButton from "@/components/SignOutButton";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const isDemo = searchParams?.get("demo") === "1";

  return (
    <div className="min-h-dvh grid grid-cols-[220px_1fr]">
      <aside className="border-r p-4 space-y-3">
        <div className="text-lg font-semibold">LocalLift</div>
        <nav className="grid gap-2 text-sm">
          <Link href="/dashboard" className="hover:underline">
            Overview
          </Link>
          <Link href="/content" className="hover:underline">
            Content
          </Link>
          <Link href="/reviews" className="hover:underline">
            Reviews
          </Link>
          <Link href="/audit" className="hover:underline">
            Audit
          </Link>
          <Link href="/settings" className="hover:underline">
            Settings
          </Link>
        </nav>
        <SignOutButton />
      </aside>
      <main className="p-6">
        {isDemo && (
          <div className="mb-4 rounded-md border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900 p-3">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              You are viewing LocalLift with sample data. Connect your Google account in Settings to see your own reviews.
            </p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}


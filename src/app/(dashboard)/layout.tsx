"use client";

import Link from "next/link";
import { ReactNode, Suspense, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { DashboardCallout, DashboardTopNav } from "@/components/dashboard";
import { Button } from "@/components/ui/button";

function readDemoCookie(): boolean {
  return typeof document !== "undefined" && document.cookie.includes("ll_demo=true");
}

function DemoBanner() {
  const searchParams = useSearchParams();
  const demoFromCookie = useSyncExternalStore(
    () => () => {},
    readDemoCookie,
    () => false
  );
  const isDemo = searchParams.get("demo") === "1" || demoFromCookie;

  if (!isDemo) return null;

  return (
    <DashboardCallout
      variant="warning"
      className="mb-2"
      action={
        <Button asChild size="sm">
          <Link href="/settings#billing">Start free trial</Link>
        </Button>
      }
    >
      <p>
        Demo mode: you&apos;re using sample reviews. Connect Google Business Profile in Settings for
        live data.
      </p>
    </DashboardCallout>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isConnectGate = pathname === "/connect";

  return (
    <div className="min-h-dvh flex flex-col">
      {!isConnectGate && (
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex max-w-5xl items-center px-4 py-3 lg:px-8">
            <DashboardTopNav />
          </div>
        </header>
      )}
      <main className="flex flex-1 flex-col p-6 lg:p-8">
        <div className="mx-auto w-full max-w-5xl flex-1">
          <Suspense fallback={null}>
            <DemoBanner />
          </Suspense>
          <div className="flex-1">{children}</div>
        </div>
      </main>
    </div>
  );
}

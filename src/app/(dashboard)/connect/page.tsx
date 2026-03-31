"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import {
  DashboardCallout,
  DashboardPage,
  DashboardPageHeader,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";

function connectErrorMessage(google: string | null, reason: string | null): string | null {
  if (google !== "error") return null;
  if (reason === "missing_refresh_token") {
    return "Google connection failed. Please try again and grant all requested permissions.";
  }
  return "Google connection failed. Please try again.";
}

function ConnectContent() {
  const searchParams = useSearchParams();
  const error = connectErrorMessage(
    searchParams.get("google"),
    searchParams.get("reason")
  );

  function handleConnectGoogle() {
    window.location.href = "/api/google/oauth/start";
  }

  return (
    <DashboardPage width="sm" className="space-y-6">
      <DashboardPageHeader
        title="Start by connecting your business"
        description="Link your Google Business Profile so we can sync your locations and reviews. You only need to do this once."
      />

      {error && (
        <DashboardCallout variant="error">
          <p>{error}</p>
        </DashboardCallout>
      )}

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          We use Google&apos;s secure sign-in to access your Business Profile data. After you
          connect, you&apos;ll land on your overview dashboard.
        </p>
        <Button type="button" size="lg" className="w-full sm:w-auto" onClick={handleConnectGoogle}>
          Connect Google Business Profile
        </Button>
      </div>
    </DashboardPage>
  );
}

export default function ConnectPage() {
  return (
    <Suspense
      fallback={
        <DashboardPage width="sm">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </DashboardPage>
      }
    >
      <ConnectContent />
    </Suspense>
  );
}

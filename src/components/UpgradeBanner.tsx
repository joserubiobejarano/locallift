"use client";

import Link from "next/link";
import { DashboardCallout } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import type { PlanStatus } from "@/lib/plan";
import { isTrialing, isFreeUser } from "@/lib/plan";

type UpgradeBannerProps = {
  planStatus: PlanStatus;
  currentPeriodEnd: string | null;
};

export function UpgradeBanner({ planStatus, currentPeriodEnd }: UpgradeBannerProps) {
  if (isTrialing(planStatus) && currentPeriodEnd) {
    const trialEndDate = new Date(currentPeriodEnd).toLocaleDateString();
    return (
      <DashboardCallout
        variant="info"
        action={
          <Button asChild size="sm">
            <Link href="/settings#billing">Upgrade now</Link>
          </Button>
        }
      >
        <p>
          Trial ends on <span className="font-medium text-foreground">{trialEndDate}</span>. Upgrade to keep
          syncing reviews, AI reply drafts, and posting to Google.
        </p>
      </DashboardCallout>
    );
  }

  if (isFreeUser(planStatus)) {
    return (
      <DashboardCallout
        variant="warning"
        action={
          <Button asChild size="sm">
            <Link href="/settings#billing">Upgrade to Starter</Link>
          </Button>
        }
      >
        <p>
          Upgrade to LocalLift Starter ($14.99/mo) to connect Google Business Profile, sync reviews, and
          use AI reply drafts.
        </p>
      </DashboardCallout>
    );
  }

  return null;
}

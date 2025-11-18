"use client";

import Link from "next/link";
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
      <div className="rounded-md border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 p-4 space-y-2">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
          Trial ends on {trialEndDate}. Upgrade now to continue using LocalLift Starter.
        </p>
        <Link href="/settings#billing">
          <Button size="sm">Upgrade Now</Button>
        </Link>
      </div>
    );
  }

  if (isFreeUser(planStatus)) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-4 space-y-2">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
          Upgrade to LocalLift Starter ($14.99/mo) to unlock this feature.
        </p>
        <Link href="/settings#billing">
          <Button size="sm">Upgrade to LocalLift Starter</Button>
        </Link>
      </div>
    );
  }

  return null;
}


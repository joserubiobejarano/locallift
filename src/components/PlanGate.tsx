"use client";

import { ReactNode } from "react";
import { UpgradeBanner } from "@/components/UpgradeBanner";
import { useCurrentPlan } from "@/lib/use-current-plan";
import { isPaidUser, isTrialing } from "@/lib/plan";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PlanGateProps = {
  children: ReactNode;
  fallback?: ReactNode;
  showBanner?: boolean;
  featureName?: string;
};

export function PlanGate({ children, fallback, showBanner = true, featureName = "this feature" }: PlanGateProps) {
  const { planStatus, isLoading, planInfo } = useCurrentPlan();

  if (isLoading) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  const hasAccess = isPaidUser(planStatus) || isTrialing(planStatus);

  if (!hasAccess) {
    return (
      <>
        {showBanner && planInfo && (
          <UpgradeBanner planStatus={planStatus} currentPeriodEnd={planInfo.currentPeriodEnd} />
        )}
        {fallback || (
          <div className="rounded-md border p-4 space-y-3">
            <div>
              <h3 className="text-sm font-medium mb-1">Premium Feature</h3>
              <p className="text-sm text-muted-foreground">
                {featureName} is available on LocalLift Starter. Upgrade to unlock.
              </p>
            </div>
            <Link href="/settings#billing">
              <Button>Upgrade to LocalLift Starter ($14.99/mo)</Button>
            </Link>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}

type PlanGateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
};

export function PlanGateModal({ open, onOpenChange, featureName = "this feature" }: PlanGateModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Please Upgrade</DialogTitle>
          <DialogDescription>
            {featureName} is available on LocalLift Starter. Upgrade to unlock this feature and more.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Link href="/settings#billing">
            <Button>Upgrade to LocalLift Starter ($14.99/mo)</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export type PlanId = "free" | "starter" | "pro" | "agency";

export function canUseGoogleConnection(plan: PlanId): boolean {
  return plan !== "free";
}

export function canUseReviewAutomation(plan: PlanId): boolean {
  return plan !== "free";
}

export function canUseUnlimitedAudits(plan: PlanId): boolean {
  return plan !== "free";
}


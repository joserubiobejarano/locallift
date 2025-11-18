export type PlanId = "free" | "starter" | "pro" | "agency";
export type PlanStatus = "free" | "active" | "trialing" | "past_due" | "canceled";

export function canUseGoogleConnection(plan: PlanId): boolean {
  return plan !== "free";
}

export function canUseReviewAutomation(plan: PlanId): boolean {
  return plan !== "free";
}

export function canUseUnlimitedAudits(plan: PlanId): boolean {
  return plan !== "free";
}

export function isPaidUser(planStatus: PlanStatus | null | undefined): boolean {
  return planStatus === "active" || planStatus === "trialing" || planStatus === "past_due";
}

export function isTrialing(planStatus: PlanStatus | null | undefined): boolean {
  return planStatus === "trialing";
}

export function isFreeUser(planStatus: PlanStatus | null | undefined): boolean {
  return !planStatus || planStatus === "free" || planStatus === "canceled";
}


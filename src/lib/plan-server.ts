import { supabaseServer } from "@/lib/supabase/server";
import type { PlanId, PlanStatus } from "@/lib/plan";

export type UserPlanInfo = {
  planId: PlanId;
  planStatus: PlanStatus;
  planType: string | null;
  currentPeriodEnd: string | null;
  aiPostsUsed: number;
  auditsUsed: number;
  usageResetDate: string | null;
};

export async function getUserPlan(userId: string): Promise<PlanId> {
  const info = await getUserPlanInfo(userId);
  return info.planId;
}

export async function getUserPlanInfo(userId: string): Promise<UserPlanInfo> {
  const supabase = await supabaseServer();

  const { data: plan } = await supabase
    .from("v_user_plan")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  // Determine effective plan status
  const planStatus: PlanStatus =
    (plan?.subscription_status as PlanStatus) ||
    (plan?.plan_status as PlanStatus) ||
    "free";

  // Determine effective plan ID
  // If subscription is active/trialing, use plan_type from profile (which should be 'starter')
  // Otherwise, use manual_plan or default to 'free'
  const effectivePlanId: PlanId =
    planStatus === "active" || planStatus === "trialing" || planStatus === "past_due"
      ? ((plan?.plan_type as PlanId) || "free")
      : ((plan?.manual_plan as PlanId) || "free");

  return {
    planId: effectivePlanId,
    planStatus,
    planType: plan?.plan_type || null,
    currentPeriodEnd: plan?.plan_current_period_end || plan?.subscription_current_period_end || null,
    aiPostsUsed: plan?.ai_posts_used || 0,
    auditsUsed: plan?.audits_used || 0,
    usageResetDate: plan?.usage_reset_date || null,
  };
}


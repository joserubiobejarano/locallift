import { supabaseServer } from "@/lib/supabase/server";
import type { PlanId } from "@/lib/plan";

export async function getUserPlan(userId: string): Promise<PlanId> {
  const supabase = await supabaseServer();

  const [{ data: profile }, { data: plan }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", userId).maybeSingle(),
    supabase.from("v_user_plan").select("*").eq("user_id", userId).maybeSingle(),
  ]);

  // If there's an active subscription, use the plan from subscription
  // Otherwise, use the manual plan from profile (defaults to 'free')
  const effectivePlan: PlanId =
    plan?.status && (plan.status === "active" || plan.status === "trialing")
      ? ((plan.manual_plan as PlanId) || "free")
      : ((profile?.plan as PlanId) || "free");

  return effectivePlan;
}


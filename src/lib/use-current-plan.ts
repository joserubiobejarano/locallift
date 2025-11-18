"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { PlanId, PlanStatus } from "@/lib/plan";

export type PlanInfo = {
  planId: PlanId;
  planStatus: PlanStatus;
  currentPeriodEnd: string | null;
  aiPostsUsed: number;
  auditsUsed: number;
  usageResetDate: string | null;
};

export function useCurrentPlan(): { planId: PlanId; planStatus: PlanStatus; isLoading: boolean; planInfo: PlanInfo | null } {
  const [planId, setPlanId] = useState<PlanId>("free");
  const [planStatus, setPlanStatus] = useState<PlanStatus>("free");
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      try {
        const supabase = supabaseBrowser();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user?.id) {
          setPlanId("free");
          setPlanStatus("free");
          setIsLoading(false);
          return;
        }

        // Get plan info from view
        const { data: plan } = await supabase
          .from("v_user_plan")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle();

        // Determine effective plan status
        const effectiveStatus: PlanStatus =
          (plan?.subscription_status as PlanStatus) ||
          (plan?.plan_status as PlanStatus) ||
          "free";

        // Determine effective plan ID
        const effectivePlanId: PlanId =
          effectiveStatus === "active" || effectiveStatus === "trialing" || effectiveStatus === "past_due"
            ? ((plan?.plan_type as PlanId) || "free")
            : ((plan?.manual_plan as PlanId) || "free");

        setPlanId(effectivePlanId);
        setPlanStatus(effectiveStatus);
        setPlanInfo({
          planId: effectivePlanId,
          planStatus: effectiveStatus,
          currentPeriodEnd: plan?.plan_current_period_end || plan?.subscription_current_period_end || null,
          aiPostsUsed: plan?.ai_posts_used || 0,
          auditsUsed: plan?.audits_used || 0,
          usageResetDate: plan?.usage_reset_date || null,
        });
      } catch (error) {
        console.error("[useCurrentPlan] error:", error);
        setPlanId("free");
        setPlanStatus("free");
      } finally {
        setIsLoading(false);
      }
    }

    loadPlan();
  }, []);

  return { planId, planStatus, isLoading, planInfo };
}


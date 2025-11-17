"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { PlanId } from "@/lib/plan";

export function useCurrentPlan(): { planId: PlanId; isLoading: boolean } {
  const [planId, setPlanId] = useState<PlanId>("free");
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
          setIsLoading(false);
          return;
        }

        // Get profile and subscription status
        const [{ data: profile }, { data: plan }] = await Promise.all([
          supabase.from("profiles").select("plan").eq("id", session.user.id).maybeSingle(),
          supabase.from("v_user_plan").select("*").eq("user_id", session.user.id).maybeSingle(),
        ]);

        // If there's an active subscription, use the plan from subscription
        // Otherwise, use the manual plan from profile (defaults to 'free')
        const effectivePlan: PlanId =
          plan?.status && (plan.status === "active" || plan.status === "trialing")
            ? (plan.manual_plan as PlanId) || "free"
            : ((profile?.plan as PlanId) || "free");

        setPlanId(effectivePlan);
      } catch (error) {
        console.error("[useCurrentPlan] error:", error);
        setPlanId("free");
      } finally {
        setIsLoading(false);
      }
    }

    loadPlan();
  }, []);

  return { planId, isLoading };
}


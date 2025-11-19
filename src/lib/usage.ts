import { supabaseAdmin } from "@/lib/supabase/admin";

const STARTER_LIMITS = {
  aiPosts: 20,
  audits: 5,
};

export async function checkUsageLimit(
  userId: string,
  type: "ai_posts" | "audits"
): Promise<{ allowed: boolean; used: number; limit: number; resetDate: string | null }> {
  const admin = supabaseAdmin();

  const { data: profile } = await admin
    .from("profiles")
    .select("ai_posts_used, audits_used, usage_reset_date, plan_type, plan_status")
    .eq("id", userId)
    .single();

  if (!profile) {
    return { allowed: false, used: 0, limit: 0, resetDate: null };
  }

  // Check if usage needs to be reset
  const resetDate = profile.usage_reset_date ? new Date(profile.usage_reset_date) : null;
  const now = new Date();
  if (resetDate && resetDate <= now) {
    // Reset usage
    await admin
      .from("profiles")
      .update({
        ai_posts_used: 0,
        audits_used: 0,
        usage_reset_date: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString().split("T")[0],
      })
      .eq("id", userId);

    return {
      allowed: true,
      used: 0,
      limit: STARTER_LIMITS[type === "ai_posts" ? "aiPosts" : "audits"],
      resetDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString().split("T")[0],
    };
  }

  // Check if user is on starter plan
  const isStarter = profile.plan_type === "starter" && 
    (profile.plan_status === "active" || profile.plan_status === "trialing" || profile.plan_status === "past_due");

  if (!isStarter) {
    // Free users have no limits (but can't use features anyway due to plan gating)
    return { allowed: true, used: 0, limit: 0, resetDate: resetDate?.toISOString().split("T")[0] || null };
  }

  const used = type === "ai_posts" ? (profile.ai_posts_used || 0) : (profile.audits_used || 0);
  const limit = STARTER_LIMITS[type === "ai_posts" ? "aiPosts" : "audits"];

  return {
    allowed: used < limit,
    used,
    limit,
    resetDate: resetDate?.toISOString().split("T")[0] || null,
  };
}

export async function incrementUsage(
  userId: string,
  type: "ai_posts" | "audits"
): Promise<void> {
  const admin = supabaseAdmin();

  const field = type === "ai_posts" ? "ai_posts_used" : "audits_used";

  try {
    const { error } = await admin.rpc("increment_usage", {
      user_id_param: userId,
      field_name: field,
    });
    
    if (error) throw error;
  } catch {
    // Fallback if RPC doesn't exist
    const { data: profile } = await admin
      .from("profiles")
      .select(field)
      .eq("id", userId)
      .single();

    const current = profile ? ((profile[field as keyof typeof profile] as number | undefined) ?? 0) : 0;

    await admin
      .from("profiles")
      .update({ [field]: current + 1 })
      .eq("id", userId);
  }
}


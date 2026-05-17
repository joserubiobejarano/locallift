import { DashboardPage } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AGENT_REGISTRY } from "@/lib/agents/registry";
import { requireUser } from "@/lib/auth";
import { getBusinessAgents, getOrCreateBusinessForUser } from "@/lib/db/businesses";
import { sql } from "@/lib/db/neon";

const MONTHLY_PRICES: Record<string, string> = {
  review_replies: "$19/month",
  review_booster: "$24/month",
  speed_to_lead: "Coming soon",
};

export default async function BillingPage() {
  const session = await requireUser();
  const resolvedUserRows = await sql`
    SELECT id
    FROM public.users
    WHERE lower(email) = lower(${session.user.email})
    LIMIT 1
  `;
  const resolvedUser = resolvedUserRows[0] as { id: string } | undefined;
  const canonicalUserId = resolvedUser?.id ?? session.user.id;

  let business;
  try {
    business = await getOrCreateBusinessForUser(canonicalUserId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Could not resolve user in public.users") && session.user.email) {
      business = await getOrCreateBusinessForUser(session.user.email);
    } else {
      throw error;
    }
  }
  const businessAgents = await getBusinessAgents(business.id);
  const statusByAgent = new Map(businessAgents.map((row) => [row.agent_id, row.status]));

  return (
    <DashboardPage width="lg" className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Billing & subscriptions</h1>
        <p className="text-sm text-foreground">Business: {business.name}</p>
      </div>

      <div className="grid gap-4">
        {AGENT_REGISTRY.map((agent) => {
          const status = statusByAgent.get(agent.id) ?? "inactive";
          const hasAccess = status === "active" || status === "trialing";
          const isComingSoon = agent.id === "speed_to_lead";
          const stateClasses = isComingSoon
            ? "border-slate-200 bg-slate-50/60"
            : hasAccess
              ? "border-emerald-300 bg-emerald-50/70"
              : "border-amber-300 bg-amber-50/70";

          return (
            <Card key={agent.id} className={`shadow-sm transition-colors ${stateClasses}`}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{agent.name}</CardTitle>
                  {isComingSoon ? (
                    <Badge className="border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-100">
                      Coming soon
                    </Badge>
                  ) : hasAccess ? (
                    <Badge className="border border-emerald-300 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="border border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-100">
                      Inactive
                    </Badge>
                  )}
                </div>
                <CardDescription>{agent.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1 text-sm">
                  <p className="text-slate-700">Monthly price: {MONTHLY_PRICES[agent.id]}</p>
                  {!isComingSoon ? (
                    <p className={hasAccess ? "font-medium text-emerald-800" : "font-medium text-amber-900"}>
                      {hasAccess ? "This agent is active for your business." : "This agent is currently inactive."}
                    </p>
                  ) : null}
                </div>
                {isComingSoon ? (
                  <Button disabled variant="outline">
                    Coming soon
                  </Button>
                ) : hasAccess ? (
                  <form action="/api/stripe/portal" method="post">
                    <Button type="submit" variant="outline">
                      Manage billing
                    </Button>
                  </form>
                ) : (
                  <form action="/api/stripe/checkout" method="post">
                    <input type="hidden" name="agent_id" value={agent.id} />
                    <Button type="submit">Activate</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardPage>
  );
}

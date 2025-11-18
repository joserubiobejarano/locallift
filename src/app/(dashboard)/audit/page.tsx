"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabaseBrowser } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { demoAuditMarkdown } from "@/lib/demo-data";
import { isDemoModeFromSearchParams } from "@/lib/demo";
import { useCurrentPlan } from "@/lib/use-current-plan";
import { isPaidUser, isTrialing } from "@/lib/plan";
import { UpgradeBanner, PlanGateModal } from "@/components/PlanGate";

type Location = {
  id: string;
  title: string | null;
};

function AuditPageContent() {
  const searchParams = useSearchParams();
  const isDemo = isDemoModeFromSearchParams(searchParams);
  const { planStatus, isLoading: planLoading, planInfo } = useCurrentPlan();
  const hasPaidAccess = isPaidUser(planStatus) || isTrialing(planStatus);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(undefined);
  const [auditMode, setAuditMode] = useState<"connected" | "quick">("quick");
  const [urlOrName, setUrlOrName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [useSampleData, setUseSampleData] = useState(false);

  const loadLocations = useCallback(async () => {
    // Never load real locations in demo mode
    if (isDemo) {
      return;
    }

    try {
      // First try to get locations from API to ensure they're synced
      const res = await fetch("/api/google/locations");
      if (res.status === 200) {
        const data = await res.json();
        if (data.locations && data.locations.length > 0) {
          // Now query gbp_locations from database to get IDs
          const supabase = supabaseBrowser();
          const { data: gbpLocations, error: dbError } = await supabase
            .from("gbp_locations")
            .select("id, title, location_id")
            .order("created_at", { ascending: false });

          if (!dbError && gbpLocations && gbpLocations.length > 0) {
            // Match API locations with gbp_locations by location_id (which matches API location.name)
            const mapped: Location[] = data.locations
              .map((apiLoc: any) => {
                const gbpLoc = gbpLocations.find(
                  (g) => g.location_id === apiLoc.name
                );
                return gbpLoc
                  ? {
                      id: gbpLoc.id,
                      title: apiLoc.title || gbpLoc.title || null,
                    }
                  : null;
              })
              .filter((loc: Location | null): loc is Location => loc !== null);

            if (mapped.length > 0) {
              setLocations(mapped);
              setAuditMode("connected");
              setSelectedLocationId(mapped[0].id);
            }
          }
        }
      }
    } catch (e) {
      // Silently ignore errors
      console.error("[audit] failed to load locations", e);
    }
  }, [isDemo]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  // If demo mode is active, automatically show sample data
  useEffect(() => {
    if (isDemo && !useSampleData && !result) {
      setUseSampleData(true);
      setResult(demoAuditMarkdown);
      setError(null);
    }
  }, [isDemo, useSampleData, result]);

  async function runAudit(mode: "connected" | "quick") {
    // Never run real audits in demo mode
    if (isDemo) {
      return;
    }

    // Check plan access for connected mode (quick mode is free via /free-audit)
    if (mode === "connected" && !hasPaidAccess) {
      setShowUpgradeModal(true);
      return;
    }

    if (mode === "connected" && !selectedLocationId) {
      alert("Please select a location");
      return;
    }

    if (mode === "quick" && !urlOrName.trim()) {
      alert("Please enter a GBP URL or business name");
      return;
    }

    setLoading(true);
    setError(null);
    setResult("");

    try {
      const res = await fetch("/api/audit/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          locationId: selectedLocationId ?? null,
          urlOrName: urlOrName || null,
          city: city || null,
          category: category || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate audit");
        return;
      }

      setResult(data.markdown || "");
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function onCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result).then(
      () => alert("Copied to clipboard"),
      () => alert("Failed to copy")
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Profile Audit</h1>
        <p className="text-muted-foreground">
          Analyze your local presence and get instant optimization tips.
        </p>
      </div>

      {(isDemo || useSampleData) && (
        <div className="rounded-md border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900 p-3">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            Demo mode – You are viewing sample data. Connect your Google account in Settings to see your real reviews and audits.
          </p>
        </div>
      )}

      {planInfo && hasPaidAccess && (
        <UpgradeBanner planStatus={planStatus} currentPeriodEnd={planInfo.currentPeriodEnd} />
      )}

      {!planLoading && !hasPaidAccess && !isDemo && (
        <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-4 space-y-2">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Upgrade to LocalLift Starter to unlock full audits with Google Business Profile connection.
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-200">
            You can still run quick audits without a connection. For a free audit, visit <Link href="/free-audit" className="underline">/free-audit</Link>.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Sample audit option */}
        {locations.length === 0 && !result && !useSampleData && !isDemo && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Just want to see how it looks?</h3>
                  <p className="text-xs text-muted-foreground">
                    Run a sample audit to see what LocalLift can do for your business.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUseSampleData(true);
                    setResult(demoAuditMarkdown);
                    setError(null);
                  }}
                >
                  Run sample audit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Connected locations section */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Connected locations</h2>
          {locations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  No Google Business locations found. Connect your account in Settings or use Quick audit below.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Location</label>
                <select
                  className="border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={selectedLocationId || ""}
                  onChange={(e) => setSelectedLocationId(e.target.value || undefined)}
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.title || "Unnamed location"}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={() => runAudit("connected")}
                disabled={loading || !selectedLocationId || useSampleData || isDemo || (!hasPaidAccess && !isDemo)}
                title={
                  (useSampleData || isDemo) 
                    ? "Exit demo mode to run a real audit" 
                    : (!hasPaidAccess ? "Premium feature" : undefined)
                }
              >
                Run audit
              </Button>
            </div>
          )}
        </div>

        {/* Quick audit section */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Quick audit (no connection)</h2>
          <div className="grid gap-3 max-w-2xl">
            <div>
              <label className="text-sm font-medium mb-1 block">
                GBP URL or business name + city
              </label>
              <Input
                placeholder="e.g., https://maps.google.com/... or 'Joe's Pizza'"
                value={urlOrName}
                onChange={(e) => setUrlOrName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">City (optional)</label>
                <Input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category (optional)</label>
                <Input
                  placeholder="e.g., Italian restaurant"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => runAudit("quick")}
                disabled={loading || !urlOrName.trim() || useSampleData || isDemo}
                title={(useSampleData || isDemo) ? "Exit demo mode to run a real audit" : undefined}
              >
                Run quick audit
              </Button>
              <p className="text-xs text-muted-foreground">
                Or try our <Link href="/free-audit" className="underline">free audit tool</Link> (no login required)
              </p>
            </div>
          </div>
        </div>

        {/* Results section */}
        {loading && (
          <div className="text-muted-foreground">Analyzing your profile…</div>
        )}

        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="prose max-w-none border rounded-md p-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            </div>
            <Button variant="secondary" onClick={onCopy}>
              Copy
            </Button>
          </div>
        )}
      </div>

      <PlanGateModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal}
        featureName="Full profile audits with Google Business Profile connection"
      />
    </div>
  );
}

export default function AuditPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Profile Audit</h1>
          <p className="text-muted-foreground">
            Analyze your local presence and get instant optimization tips.
          </p>
        </div>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <AuditPageContent />
    </Suspense>
  );
}


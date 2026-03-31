"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  DashboardCallout,
  DashboardEmptyState,
  DashboardPage,
  DashboardPageHeader,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { nativeSelectClassName } from "@/lib/form-controls";
import { demoLocations, demoReviews } from "@/lib/demo-data";
import { useCurrentPlan } from "@/lib/use-current-plan";
import { isPaidUser, isTrialing } from "@/lib/plan";
import {
  isDemoModeFromSearchParams,
  DEMO_LIMITS,
  DEMO_STORAGE_KEYS,
  incrementDemoUsage,
  checkDemoLimit
} from "@/lib/demo";
import { UpgradeBanner, PlanGateModal } from "@/components/PlanGate";
import { UpgradeModal } from "@/components/UpgradeModal";
import { toast } from "sonner";

type Location = { name: string; title?: string };

type Review = {
  google_review_id: string;
  reviewer_name?: string;
  star_rating?: number | null;
  comment?: string | null;
  status: string;
  review_update_time?: string | null;
  isSample?: boolean;
};

type ReviewWorkflow = "unanswered" | "unsaved_draft" | "draft_saved" | "posted";

type WorkflowBadgeConfig = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  className?: string;
};

function getReviewWorkflowDisplay(
  review: Review,
  draftText: string,
  savedSnapshots: Record<string, string>,
  isDemo: boolean
): { workflow: ReviewWorkflow; badge: WorkflowBadgeConfig } {
  const id = review.google_review_id;
  const isPosted = review.status.toLowerCase() === "replied";
  const inTestContext = Boolean(review.isSample || isDemo);

  if (isPosted) {
    return {
      workflow: "posted",
      badge: {
        label: inTestContext ? "Posted (test mode)" : "Replied",
        variant: "secondary",
        className:
          "border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100",
      },
    };
  }

  const trimmed = draftText.trim();
  if (!trimmed) {
    return {
      workflow: "unanswered",
      badge: {
        label: "Unanswered",
        variant: "outline",
        className: "text-muted-foreground",
      },
    };
  }

  const saved = savedSnapshots[id];
  if (saved !== undefined && saved === draftText) {
    return {
      workflow: "draft_saved",
      badge: {
        label: "Draft saved",
        variant: "secondary",
        className:
          "border-sky-500/40 bg-sky-500/10 text-sky-950 dark:text-sky-100",
      },
    };
  }

  return {
    workflow: "unsaved_draft",
    badge: {
      label: "Unsaved draft",
      variant: "outline",
      className:
        "border-amber-500/55 bg-amber-500/10 text-amber-950 dark:text-amber-100",
    },
  };
}

function shouldShowTestWorkflowActions(review: Review, isDemo: boolean): boolean {
  return Boolean(review.isSample || isDemo);
}

/** Sample reviews for testing the reply workflow when no real reviews exist. */
function buildSampleReviews(): Review[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return [
    {
      google_review_id: "sample-review-1",
      reviewer_name: "Sarah Mitchell",
      star_rating: 5,
      comment: "Amazing service and super friendly staff. Will definitely come back!",
      status: "unanswered",
      review_update_time: new Date(now - 2 * day).toISOString(),
      isSample: true,
    },
    {
      google_review_id: "sample-review-2",
      reviewer_name: "Daniel Perez",
      star_rating: 4,
      comment: "Great food and nice atmosphere. Service was a little slow but overall a good experience.",
      status: "unanswered",
      review_update_time: new Date(now - 5 * day).toISOString(),
      isSample: true,
    },
    {
      google_review_id: "sample-review-3",
      reviewer_name: "Laura Chen",
      star_rating: 3,
      comment: "The place is nice but the wait time was quite long.",
      status: "unanswered",
      review_update_time: new Date(now - 7 * day).toISOString(),
      isSample: true,
    },
    {
      google_review_id: "sample-review-4",
      reviewer_name: "Mark Thompson",
      star_rating: 2,
      comment: "Not very happy with the experience. The order took forever and the staff seemed overwhelmed.",
      status: "unanswered",
      review_update_time: new Date(now - 10 * day).toISOString(),
      isSample: true,
    },
  ];
}

function ReviewsPageContent() {
  const searchParams = useSearchParams();
  const isDemo = isDemoModeFromSearchParams(searchParams);
  const { planStatus, planInfo } = useCurrentPlan();
  const hasPaidAccess = isPaidUser(planStatus) || isTrialing(planStatus);
  const [showPlanGateModal, setShowPlanGateModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const NO_CONNECTED_MSG =
    "No connected Google Business Profile yet. You can still test the workflow with sample reviews.";
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  /** Last text snapshot when user clicked Save draft (per review id). */
  const [savedDraftSnapshots, setSavedDraftSnapshots] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function mapSyncError(raw: unknown): string {
    if (raw && typeof raw === "object" && "error" in raw && typeof raw.error === "string") {
      const msg = raw.error.toLowerCase();
      if (msg.includes("location not found")) return "No locations were found for this account.";
      if (msg.includes("no google connection")) return "Google connection failed. Please try again.";
      return raw.error;
    }
    return "Review sync failed. Please try again.";
  }

  // Load locations on mount (real mode only)
  useEffect(() => {
    if (!isDemo) {
      loadLocations();
    } else {
      // In demo mode, use demo locations
      if (demoLocations.length > 0 && !selectedLoc) {
        setSelectedLoc(demoLocations[0].location_name);
      }
    }
  }, [isDemo]);

  // Load reviews when location changes
  useEffect(() => {
    if (isDemo && selectedLoc) {
      const demoReviewsData = demoReviews(selectedLoc);
      setReviews(
        demoReviewsData.map((r) => ({
          google_review_id: r.google_review_id,
          reviewer_name: r.reviewer_name,
          star_rating: r.star_rating,
          comment: r.comment,
          status: r.status,
        }))
      );
      const nextDrafts: Record<string, string> = {};
      const nextSaved: Record<string, string> = {};
      for (const r of demoReviewsData) {
        if (r.reply_comment) {
          nextDrafts[r.google_review_id] = r.reply_comment;
          if (r.status === "replied") {
            nextSaved[r.google_review_id] = r.reply_comment;
          }
        }
      }
      setDrafts(nextDrafts);
      setSavedDraftSnapshots(nextSaved);
    } else if (!isDemo && selectedLoc) {
      setDrafts({});
      setSavedDraftSnapshots({});
      loadReviews();
    } else {
      setReviews([]);
      setDrafts({});
      setSavedDraftSnapshots({});
    }
  }, [isDemo, selectedLoc]);

  async function loadLocations() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/google/locations/list");
      if (!r.ok) {
        if (r.status === 401) {
          setError(NO_CONNECTED_MSG);
        } else {
          setError("Failed to load locations");
        }
        return;
      }
      const j = await r.json();
      if (j.locations) {
        setLocations(j.locations);
        if (j.locations.length > 0 && !selectedLoc) {
          setSelectedLoc(j.locations[0].locationName);
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load locations");
    } finally {
      setLoading(false);
    }
  }

  async function syncReviews() {
    if (!selectedLoc) return;

    if (isDemo) {
      // Demo mode: just show a toast and reload demo data
      setSyncing(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const demoReviewsData = demoReviews(selectedLoc);
      setReviews(
        demoReviewsData.map((r) => ({
          google_review_id: r.google_review_id,
          reviewer_name: r.reviewer_name,
          star_rating: r.star_rating,
          comment: r.comment,
          status: r.status,
        }))
      );
      const nextDrafts: Record<string, string> = {};
      const nextSaved: Record<string, string> = {};
      for (const r of demoReviewsData) {
        if (r.reply_comment) {
          nextDrafts[r.google_review_id] = r.reply_comment;
          if (r.status === "replied") {
            nextSaved[r.google_review_id] = r.reply_comment;
          }
        }
      }
      setDrafts(nextDrafts);
      setSavedDraftSnapshots(nextSaved);
      setSyncing(false);
      toast.success("Reviews refreshed (demo)");
      return;
    }

    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/google/reviews/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationName: selectedLoc }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(mapSyncError(body));
      }

      // Reload reviews after sync
      await loadReviews();
      toast.success("Reviews synced successfully");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Review sync failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setSyncing(false);
    }
  }

  async function loadReviews() {
    if (!selectedLoc) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reviews?loc=${encodeURIComponent(selectedLoc)}`);
      if (!res.ok) {
        throw new Error("Failed to load reviews");
      }
      const js = await res.json();
      if (Array.isArray(js.items)) {
        setReviews(js.items);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }

  async function generate(review: Review) {
    if (isDemo) {
      if (checkDemoLimit(DEMO_STORAGE_KEYS.REPLIES_USED, DEMO_LIMITS.REPLIES)) {
        setShowUpgradeModal(true);
        return;
      }
    }

    const body = review.isSample
      ? {
          businessName: "My Business",
          city: "Local",
          rating: Math.min(5, Math.max(1, Number(review.star_rating) || 5)),
          text: review.comment || "",
        }
      : {
          reviewText: review.comment || "",
          businessName: "",
          city: "",
          rating: Math.min(5, Math.max(1, Number(review.star_rating) || 5)),
        };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(isDemo ? { "x-demo": "true" } : {}),
      ...(review.isSample ? { "x-sample-review": "true" } : {}),
    };

    const r = await fetch("/api/openai/review-reply", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    let j: { reply?: string; markdown?: string; text?: string; error?: string } = {};
    try {
      j = await r.json();
    } catch {
      // non-JSON response
    }

    if (!r.ok) {
      const message = j?.error ?? `Generate failed (${r.status})`;
      toast.error(message);
      return;
    }

    const replyText = j.reply ?? j.markdown ?? j.text ?? "";
    setDrafts((d) => ({ ...d, [review.google_review_id]: replyText }));

    if (isDemo) {
      incrementDemoUsage(DEMO_STORAGE_KEYS.REPLIES_USED);
      toast.success(
        "Reply generated. Review the text below, then save as draft when ready. (Demo usage tracked)"
      );
    } else if (review.isSample) {
      toast.success(
        "Reply generated. Review below, save as draft, then mark as posted (test mode) when final."
      );
    } else {
      toast.success("Reply generated. Edit if needed, then post to Google when ready.");
    }
  }

  async function post(review: Review) {
    if (isDemo) {
      setShowUpgradeModal(true);
      return;
    }

    const reply = drafts[review.google_review_id];
    if (!reply?.trim() || !selectedLoc) {
      toast.error("Write or generate a reply before posting.");
      return;
    }

    const r = await fetch("/api/google/replies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewId: review.google_review_id,
        locationName: selectedLoc,
        reply,
      }),
    });

    if (r.ok) {
      await loadReviews();
      toast.success("Reply posted successfully");
    } else {
      toast.error("Failed to post reply");
    }
  }

  function saveTestDraft(review: Review) {
    if (!shouldShowTestWorkflowActions(review, isDemo)) return;
    const text = drafts[review.google_review_id] ?? "";
    if (!text.trim()) {
      toast.error("Nothing to save yet — generate a reply or type your draft first.");
      return;
    }
    setSavedDraftSnapshots((s) => ({
      ...s,
      [review.google_review_id]: text,
    }));
    toast.success(
      "Draft saved. Mark as posted (test mode) when this reply is final, or keep editing."
    );
  }

  function markAsPostedTest(review: Review) {
    if (!shouldShowTestWorkflowActions(review, isDemo)) return;
    const reply = drafts[review.google_review_id];
    if (!reply?.trim()) {
      toast.error("Add or generate a reply first.");
      return;
    }
    setReviews((prev) =>
      prev.map((r) =>
        r.google_review_id === review.google_review_id ? { ...r, status: "replied" } : r
      )
    );
    setSavedDraftSnapshots((s) => ({
      ...s,
      [review.google_review_id]: reply,
    }));
    toast.success(
      "Marked as posted (test mode). This review is handled — no further action needed for the demo."
    );
  }

  const isSampleMode = reviews.length > 0 && reviews.every((r) => r.isSample);
  const displayLocations = isDemo ? demoLocations.map((l) => ({ name: l.location_name, title: l.title })) : locations;
  const hasRealLocations = locations.length > 0;

  // Keep one sample review expanded; default to first when list changes
  useEffect(() => {
    if (isSampleMode && reviews.length > 0) {
      const ids = reviews.map((r) => r.google_review_id);
      setExpandedId((prev) => (prev && ids.includes(prev) ? prev : ids[0]));
    } else {
      setExpandedId(null);
    }
  }, [isSampleMode, reviews.length, reviews[0]?.google_review_id]);

  const isNoConnectedOnly = error === NO_CONNECTED_MSG;

  const reviewSummary = useMemo(() => {
    let unanswered = 0;
    let draftsActive = 0;
    let posted = 0;
    for (const rv of reviews) {
      const draftText = drafts[rv.google_review_id] ?? "";
      const { workflow } = getReviewWorkflowDisplay(rv, draftText, savedDraftSnapshots, isDemo);
      if (workflow === "unanswered") unanswered += 1;
      else if (workflow === "posted") posted += 1;
      else draftsActive += 1;
    }
    return { total: reviews.length, unanswered, drafts: draftsActive, posted };
  }, [reviews, drafts, savedDraftSnapshots, isDemo]);

  return (
    <DashboardPage width="md" className="space-y-8">
      <DashboardPageHeader
        title="Reviews"
        description="Sync reviews from Google Business Profile, draft AI replies, then save drafts or post to Google — same workflow as on Overview."
      />

      <div className="space-y-3">
        {!hasRealLocations && !isDemo && !loading && (
          <DashboardCallout
            variant="neutral"
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/settings">Go to Settings</Link>
              </Button>
            }
          >
            <p className="text-muted-foreground">
              Connect Google Business Profile and sync locations in Settings to load your review inbox.
            </p>
          </DashboardCallout>
        )}

        {isDemo && (
          <DashboardCallout variant="neutral">
            <p className="text-muted-foreground">
              Demo mode — you are viewing sample data. Connect your Google account in Settings to see
              your real reviews.
            </p>
          </DashboardCallout>
        )}

        {isSampleMode && (
          <DashboardCallout variant="neutral" title="Test mode — sample reviews">
            <p className="text-muted-foreground">
              Sample reviews for internal testing. These are not live Google reviews.
            </p>
          </DashboardCallout>
        )}

        {planInfo && hasPaidAccess && !isDemo && (
          <UpgradeBanner planStatus={planStatus} currentPeriodEnd={planInfo.currentPeriodEnd} />
        )}

        {error && isNoConnectedOnly && (
          <DashboardCallout variant="neutral">
            <p className="text-muted-foreground">{error}</p>
          </DashboardCallout>
        )}
        {error && !isNoConnectedOnly && (
          <DashboardCallout variant="error">
            <p>{error}</p>
          </DashboardCallout>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          className={cn(nativeSelectClassName, "min-w-[200px] sm:min-w-[220px] sm:max-w-md sm:flex-1")}
          value={selectedLoc}
          onChange={(e) => setSelectedLoc(e.target.value)}
          disabled={loading}
        >
          <option value="">Select a location</option>
          {displayLocations.map((l) => (
            <option key={l.name} value={l.name}>
              {l.title || l.name}
            </option>
          ))}
        </select>

        <Button
          onClick={() => {
            if (!hasPaidAccess && !isDemo) {
              setShowPlanGateModal(true);
              return;
            }
            syncReviews();
          }}
          disabled={!selectedLoc || syncing || loading}
          title={isDemo ? "Demo mode - click to refresh sample data" : (!hasPaidAccess ? "Premium feature" : undefined)}
        >
          {syncing ? "Syncing..." : "Sync reviews now"}
        </Button>
      </div>

      {reviews.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground"
          aria-live="polite"
        >
          <span className="font-semibold text-foreground">Summary</span>
          <Badge variant="outline" className="font-normal tabular-nums">
            Loaded {reviewSummary.total}
          </Badge>
          <Badge variant="outline" className="font-normal tabular-nums">
            Unanswered {reviewSummary.unanswered}
          </Badge>
          <Badge variant="outline" className="font-normal tabular-nums">
            Drafts {reviewSummary.drafts}
          </Badge>
          <Badge variant="outline" className="font-normal tabular-nums">
            Posted {reviewSummary.posted}
          </Badge>
        </div>
      )}

      {loading && reviews.length === 0 && (
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground shadow-sm">
          <p>Loading reviews…</p>
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <DashboardEmptyState
          title="No reviews yet"
          description="You can connect a Google Business Profile or load sample reviews to test the reply workflow."
        >
          <Button
            variant="secondary"
            onClick={() => {
              setDrafts({});
              setSavedDraftSnapshots({});
              setReviews(buildSampleReviews());
            }}
          >
            Load sample reviews
          </Button>
        </DashboardEmptyState>
      )}

      <div className="space-y-4">
        {reviews.map((rv) => {
          const draftText = drafts[rv.google_review_id] ?? "";
          const { workflow, badge } = getReviewWorkflowDisplay(
            rv,
            draftText,
            savedDraftSnapshots,
            isDemo
          );
          const isHandled = workflow === "posted";
          const showTestActions = shouldShowTestWorkflowActions(rv, isDemo);
          const showTestModeHandledNote =
            isHandled && (rv.isSample || isDemo);

          const isExpanded = !isSampleMode || expandedId === rv.google_review_id;
          if (isSampleMode && !isExpanded) {
            const preview = (rv.comment ?? "").slice(0, 80);
            return (
              <button
                key={rv.google_review_id}
                type="button"
                onClick={() => setExpandedId(rv.google_review_id)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  isHandled
                    ? "border-emerald-500/35 bg-emerald-500/[0.06] hover:bg-emerald-500/10"
                    : "border-border bg-card hover:bg-muted/40"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                      <span className="font-medium text-foreground">{rv.reviewer_name ?? "Anonymous"}</span>
                      <span className="text-muted-foreground">
                        {typeof rv.star_rating === "number" ? `${rv.star_rating}★` : "—"}
                      </span>
                      {rv.review_update_time && (
                        <span className="text-muted-foreground text-xs">
                          {new Date(rv.review_update_time).toLocaleDateString()}
                        </span>
                      )}
                      <Badge variant={badge.variant} className={cn("text-[10px]", badge.className)}>
                        {badge.label}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground truncate">
                      {preview}
                      {preview.length >= 80 ? "…" : ""}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">Click to expand</span>
                </div>
              </button>
            );
          }
          return (
            <div
              key={rv.google_review_id}
              className={cn(
                "rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm transition-colors",
                isHandled &&
                  "border-emerald-500/40 bg-emerald-500/[0.05] shadow-none"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <span className="font-medium text-foreground">{rv.reviewer_name ?? "Anonymous"}</span>
                    <span className="text-muted-foreground">
                      {typeof rv.star_rating === "number" ? `${rv.star_rating}★` : "—"}
                    </span>
                    {rv.review_update_time && (
                      <span className="text-muted-foreground">
                        {new Date(rv.review_update_time).toLocaleDateString()}
                      </span>
                    )}
                    <Badge variant={badge.variant} className={cn("text-xs", badge.className)}>
                      {badge.label}
                    </Badge>
                    {isDemo && (
                      <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                        demo
                      </Badge>
                    )}
                    {rv.isSample && (
                      <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                        Sample
                      </Badge>
                    )}
                  </div>
                  {showTestModeHandledNote && (
                    <p className="text-xs text-emerald-800 dark:text-emerald-200/90">
                      Handled for this demo — reply area is locked. Use &quot;Load sample reviews&quot; or refresh to reset.
                    </p>
                  )}
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{rv.comment}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {isSampleMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground"
                      onClick={() => setExpandedId(null)}
                    >
                      Collapse
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Draft reply</label>
                  {workflow === "unsaved_draft" && !isHandled && (
                    <span className="text-[10px] text-amber-700 dark:text-amber-200/90">
                      Not saved yet — click Save draft to pin this version
                    </span>
                  )}
                  {workflow === "draft_saved" && !isHandled && (
                    <span className="text-[10px] text-sky-800 dark:text-sky-200/90">
                      Draft saved — edit anytime, or mark as posted when final
                    </span>
                  )}
                </div>
                <Textarea
                  value={draftText}
                  onChange={(e) =>
                    setDrafts((d) => ({ ...d, [rv.google_review_id]: e.target.value }))
                  }
                  placeholder={
                    showTestActions ? "Edit your reply (test mode)" : "Your reply will be posted to Google"
                  }
                  className="min-h-[80px] resize-y"
                  readOnly={isHandled}
                  aria-readonly={isHandled}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <Button
                  onClick={() => {
                    if (!hasPaidAccess && !isDemo && !rv.isSample) {
                      setShowPlanGateModal(true);
                      return;
                    }
                    generate(rv);
                  }}
                  title={!hasPaidAccess && !isDemo && !rv.isSample ? "Premium feature" : undefined}
                  disabled={isHandled}
                >
                  Generate reply
                </Button>
                {showTestActions && (
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => saveTestDraft(rv)}
                    disabled={isHandled || !draftText.trim()}
                  >
                    Save draft
                  </Button>
                )}
                {showTestActions ? (
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => markAsPostedTest(rv)}
                    disabled={isHandled || !draftText.trim()}
                    className="text-muted-foreground"
                  >
                    Mark as posted (test mode)
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!hasPaidAccess && !isDemo) {
                        setShowPlanGateModal(true);
                        return;
                      }
                      post(rv);
                    }}
                    disabled={isHandled || !draftText.trim() || isDemo}
                    title={isDemo ? "Posting disabled in demo mode" : undefined}
                  >
                    Post to Google
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <PlanGateModal
        open={showPlanGateModal}
        onOpenChange={setShowPlanGateModal}
        featureName="Syncing reviews from Google Business Profile, AI reply drafts, and posting replies"
      />

      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        description={isDemo ? "You've reached the demo limit for AI reply drafts. Start your free trial for full review inbox access." : undefined}
      />
    </DashboardPage>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense
      fallback={
        <DashboardPage width="md">
          <DashboardPageHeader title="Reviews" description="Loading…" />
        </DashboardPage>
      }
    >
      <ReviewsPageContent />
    </Suspense>
  );
}


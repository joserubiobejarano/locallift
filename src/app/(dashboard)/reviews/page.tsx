"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import { demoLocations, demoReviews } from "@/lib/demo-data";
import { useCurrentPlan } from "@/lib/use-current-plan";
import { canUseReviewAutomation } from "@/lib/plan";
import { isDemoModeFromSearchParams } from "@/lib/demo";

type Location = { name: string; title?: string };

type Review = {

  google_review_id: string;

  reviewer_name?: string;

  star_rating?: number | null;

  comment?: string | null;

  status: string;

};

function ReviewsPageContent() {
  const searchParams = useSearchParams();
  const isDemo = isDemoModeFromSearchParams(searchParams);
  const { planId, isLoading: planLoading } = useCurrentPlan();
  const canUseAutomation = canUseReviewAutomation(planId);

  const [locations, setLocations] = useState<Location[]>([]);

  const [selectedLoc, setSelectedLoc] = useState<string>("");

  const [reviews, setReviews] = useState<Review[]>([]);

  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [useSampleData, setUseSampleData] = useState(false);

  async function syncLocations() {

    setLoading(true);

    try {

      const r = await fetch("/api/google/locations");

      const j = await r.json();

      if (j.locations) setLocations(j.locations);

    } finally {

      setLoading(false);

    }

  }

  async function syncReviews() {

    if (!selectedLoc) return;

    setLoading(true);

    try {

      await fetch("/api/google/reviews/sync", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ locationName: selectedLoc }),

      });

      // simple fetch from our DB (reuse projects API style)

      const res = await fetch(`/api/reviews?loc=${encodeURIComponent(selectedLoc)}`);

      const js = await res.json();

      if (Array.isArray(js.items)) setReviews(js.items);

    } finally {

      setLoading(false);

    }

  }

  async function loadReviews() {

    if (!selectedLoc) return;

    const res = await fetch(`/api/reviews?loc=${encodeURIComponent(selectedLoc)}`);

    const js = await res.json();

    if (Array.isArray(js.items)) setReviews(js.items);

  }

  async function generate(review: Review) {

    const body = {

      type: "review-reply",

      reviewText: review.comment || "",

      businessName: "",

      city: "",

      serviceType: "",

      tone: "Friendly and helpful",

    };

    const r = await fetch("/api/openai/review-reply", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(body),

    });

    const j = await r.json();

    setDrafts((d) => ({ ...d, [review.google_review_id]: j.markdown || j.text || "" }));

  }

  async function post(review: Review) {

    const reply = drafts[review.google_review_id];

    if (!reply || !selectedLoc) return;

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

    } else {

      alert("Failed to post reply");

    }

  }

  useEffect(() => {

    // initial try: load locations silently

    (async () => {

      try {

        const r = await fetch("/api/google/locations");

        const j = await r.json();

        if (j.locations) setLocations(j.locations);

      } catch {}

    })();

  }, []);

  // If demo mode is active, always use sample data
  useEffect(() => {
    if (isDemo) {
      setUseSampleData(true);
      if (demoLocations.length > 0 && !selectedLoc) {
        setSelectedLoc(demoLocations[0].location_name);
      }
    }
  }, [isDemo, selectedLoc]);

  useEffect(() => {
    if ((useSampleData || isDemo) && selectedLoc) {
      const demoReviewsData = demoReviews(selectedLoc);
      setReviews(demoReviewsData.map((r) => ({
        google_review_id: r.google_review_id,
        reviewer_name: r.reviewer_name,
        star_rating: r.star_rating,
        comment: r.comment,
        status: r.status,
      })));
    } else if ((useSampleData || isDemo) && !selectedLoc) {
      setReviews([]);
    }
  }, [useSampleData, isDemo, selectedLoc]);

  const displayLocations = (useSampleData || isDemo) ? demoLocations.map((l) => ({ name: l.location_name, title: l.title })) : locations;
  const hasRealLocations = locations.length > 0;

  // Show upgrade message if not in demo mode and plan doesn't allow review automation
  if (!isDemo && !planLoading && !canUseAutomation) {
    return (
      <div className="space-y-4 p-4">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Turn reviews into customers on autopilot</h1>
          <p className="text-muted-foreground">
            Automatically generate and post replies to your Google reviews. Save time while maintaining a professional presence that builds trust with potential customers.
          </p>
          <p className="text-muted-foreground mt-2">
            This feature is available on paid plans. Upgrade to unlock review automation and start growing your business.
          </p>
        </div>
        <Link href="/settings#billing">
          <Button>Upgrade to unlock</Button>
        </Link>
      </div>
    );
  }

  return (

    <div className="space-y-4 p-4">

      {!hasRealLocations && !useSampleData && !isDemo && (
        <div className="rounded-md border p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Just exploring?</p>
              <p className="text-xs text-muted-foreground mt-1">
                View sample reviews to see how LocalLift works
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUseSampleData(true);
                if (demoLocations.length > 0) {
                  setSelectedLoc(demoLocations[0].location_name);
                }
              }}
            >
              View sample reviews
            </Button>
          </div>
        </div>
      )}

      {(useSampleData || isDemo) && (
        <div className="rounded-md border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900 p-3">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            Demo mode – You are viewing sample data. Connect your Google account in Settings to see your real reviews and audits.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">

        <Button onClick={syncLocations} disabled={loading || useSampleData || isDemo}>

          Sync Locations

        </Button>

        <select

          className="border-input dark:bg-input/30 h-9 w-full min-w-[200px] rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

          value={selectedLoc}

          onChange={(e) => setSelectedLoc(e.target.value)}

        >

          <option value="">Select a location</option>

          {displayLocations.map((l) => (

            <option key={l.name} value={l.name}>

              {l.title || l.name}

            </option>

          ))}

        </select>

        <Button onClick={syncReviews} disabled={!selectedLoc || loading || useSampleData || isDemo}>

          Sync Reviews

        </Button>

      </div>

      <div className="space-y-6">

        {reviews.map((rv) => (

          <div key={rv.google_review_id} className="rounded border p-3 space-y-2">

            <div className="text-sm opacity-70">

              {rv.reviewer_name} • {rv.star_rating ?? "-"}★ • {rv.status}

            </div>

            <div className="text-sm whitespace-pre-wrap">{rv.comment}</div>

            <Textarea

              value={drafts[rv.google_review_id] || ""}

              onChange={(e) =>

                setDrafts((d) => ({ ...d, [rv.google_review_id]: e.target.value }))

              }

              placeholder="Draft reply (will be posted to Google)"

            />

            <div className="flex gap-2">

              <Button variant="secondary" onClick={() => generate(rv)} disabled={useSampleData || isDemo}>

                Generate

              </Button>

              <Button onClick={() => post(rv)} disabled={!drafts[rv.google_review_id] || useSampleData || isDemo}>

                {(useSampleData || isDemo) ? "Demo mode - reply not actually sent" : "Post to Google"}

              </Button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default function ReviewsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4 p-4">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Turn reviews into customers on autopilot</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ReviewsPageContent />
    </Suspense>
  );
}


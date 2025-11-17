"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ensureBrowserToken } from "@/lib/ensure-token";

type SummaryData = {
  projectsCount: number;
  reviewsCount: number;
  locationsCount: number;
};

type DisplaySummary = SummaryData & {
  averageRating?: number;
  profileFixes?: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        setError(null);
        
        const token = await ensureBrowserToken();
        if (!token) {
          setError("Please log in again.");
          setLoading(false);
          return;
        }

        console.log(
          "[Dashboard] calling /api/dashboard/summary with token len:",
          token.length
        );
        const res = await fetch("/api/dashboard/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (res.status === 401) {
          setError("Please log in again.");
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load stats");
        }

        const data = await res.json();
        setSummary(data);
      } catch (e) {
        console.error("[Dashboard] error fetching summary:", e);
        setError("Couldn't load your stats. Try refreshing the page.");
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your local presence.
        </p>
      </div>

      {loading && (
        <div className="text-sm text-muted-foreground">Loading...</div>
      )}

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      )}

      {!loading && !error && summary && (() => {
        const showDemo = summary.projectsCount === 0 && summary.reviewsCount === 0 && summary.locationsCount === 0;
        const displaySummary: DisplaySummary = showDemo
          ? { projectsCount: 12, reviewsCount: 24, locationsCount: 3, averageRating: 4.7, profileFixes: 3 }
          : summary;

        return (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Content projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">{displaySummary.projectsCount}</div>
                  <CardDescription className="mt-2">
                    Saved ideas and articles.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    {showDemo ? "New reviews this month" : "Reviews stored"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">{displaySummary.reviewsCount}</div>
                  <CardDescription className="mt-2">
                    {showDemo
                      ? `${displaySummary.averageRating} average rating.`
                      : "From your connected profiles."}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    {showDemo ? "Suggested profile fixes" : "GBP locations"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">
                    {showDemo ? displaySummary.profileFixes : displaySummary.locationsCount}
                  </div>
                  <CardDescription className="mt-2">
                    {showDemo
                      ? "Waiting for your attention."
                      : summary.locationsCount === 0
                      ? "Connect Google in Settings to sync locations."
                      : "Connected from Google Business Profile."}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {showDemo && (
              <div className="rounded-md border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Showing a sample snapshot. Connect your Google Business Profile to see real numbers.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Quick actions</h2>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => router.push("/content")}>
                  Generate content
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/reviews")}
                >
                  Reply to reviews
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/audit")}
                >
                  Run quick audit
                </Button>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export default function FreeAuditPage() {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  async function runAudit() {
    if (!businessName.trim() || !email.trim()) {
      setError("Business name and email are required");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setScore(null);

    try {
      const res = await fetch("/api/audit/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "quick",
          urlOrName: businessName,
          city: city || null,
          category: category || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate audit");
        return;
      }

      const markdown = data.markdown || "";

      // Extract score from markdown (look for "Score: XX/100")
      const scoreMatch = markdown.match(/Score:\s*(\d+)\/100/i);
      const extractedScore = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
      setScore(extractedScore);

      setResult(markdown);

      // Store lead in database
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            query_text: `${businessName}${city ? `, ${city}` : ""}${category ? ` - ${category}` : ""}`,
            audit_result: { markdown, score: extractedScore },
            user_agent: navigator.userAgent,
          }),
        });
      } catch (leadError) {
        console.error("Failed to save lead:", leadError);
        // Don't fail the audit if lead saving fails
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score: number | null): string {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  }

  function getScoreBgColor(score: number | null): string {
    if (!score) return "bg-muted";
    if (score >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Free Google Business Profile Audit</h1>
          <p className="text-lg text-muted-foreground">
            Get instant AI-powered insights to improve your local presence
          </p>
        </div>

        {!result ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Your Business Details</CardTitle>
              <CardDescription>
                No login required. Get your free audit in seconds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Business Name or GBP URL <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Joe's Pizza or https://maps.google.com/..."
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll send you the audit results and optimization tips.
                  </p>
                </div>

                {error && (
                  <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  onClick={runAudit}
                  disabled={loading || !businessName.trim() || !email.trim()}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Analyzing your profile..." : "Run Free Audit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Score Display */}
            {score !== null && (
              <Card className={`${getScoreBgColor(score)} border-2`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
                      {score}
                    </div>
                    <div className="text-2xl text-muted-foreground mb-4">/ 100</div>
                    <p className="text-sm font-medium">
                      {score >= 80
                        ? "Great! Your profile is well-optimized."
                        : score >= 60
                        ? "Good start, but there's room for improvement."
                        : "Your profile needs significant optimization."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Audit Results */}
            <Card>
              <CardHeader>
                <CardTitle>Audit Results</CardTitle>
                <CardDescription>
                  Review the recommendations below to improve your Google Business Profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">
                    Want ongoing optimization and automated review replies?
                  </h3>
                  <p className="text-muted-foreground">
                    Try LocalLift Starter for $14.99/mo and get:
                  </p>
                  <ul className="text-left max-w-md mx-auto space-y-2 text-sm">
                    <li>✓ Automated review reply generation</li>
                    <li>✓ Google Business Profile sync</li>
                    <li>✓ Unlimited review replies</li>
                    <li>✓ 20 Local SEO posts per month</li>
                    <li>✓ 5 full audits per month</li>
                  </ul>
                  <div className="pt-4">
                    <Link href="/signup">
                      <Button size="lg">Start Free Trial - $14.99/mo</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setScore(null);
                  setError(null);
                }}
              >
                Run Another Audit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


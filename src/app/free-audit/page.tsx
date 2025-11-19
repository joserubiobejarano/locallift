"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AuditResult = {
  auditText: string;
  score: number | null;
};

export default function FreeAuditPage() {
  const [businessQuery, setBusinessQuery] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Clear previous error
    setError(null);

    // Validate client side
    if (!businessQuery.trim() || !email.trim()) {
      setError("Business name and email are required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/audit/free-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessQuery: businessQuery.trim(),
          city: city.trim() || null,
          category: category.trim() || null,
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again in a minute.");
        return;
      }

      // Save result
      setResult({
        auditText: data.auditText || "",
        score: data.score ?? null,
      });

      // Scroll to results
      setTimeout(() => {
        const resultsSection = document.getElementById("results-section");
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (e: any) {
      setError("Something went wrong. Please try again in a minute.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopyReport() {
    if (!result?.auditText) return;
    
    navigator.clipboard.writeText(result.auditText).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      },
      () => {
        // Failed to copy - could show error but keeping it simple
      }
    );
  }

  function getScoreBadge(score: number | null) {
    if (score === null) {
      return (
        <span className="inline-flex items-center rounded-full bg-slate-700/50 px-3 py-1 text-xs font-medium text-slate-300">
          No score detected
        </span>
      );
    }
    if (score < 60) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300">
          Needs work
        </span>
      );
    }
    if (score < 80) {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-300">
          Good
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300">
        Great
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-48 top-0 h-72 w-72 rounded-full bg-purple-700/30 blur-3xl" />
        <div className="absolute -right-40 top-40 h-72 w-72 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-orange-400">
            <span className="text-sm font-semibold text-slate-950">LL</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">LocalLift</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-slate-100/80 hover:text-white md:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm hover:bg-white"
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-20 pt-8 md:px-6 lg:px-8">
        {/* Hero section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl mb-4">
            Free Google Business Profile audit
          </h1>
          <p className="text-lg text-slate-200/80 sm:text-xl max-w-2xl mx-auto">
            See how your profile looks to local customers, what is missing, and what to fix first. No login required.
          </p>
        </div>

        {/* Audit form card */}
        {!result && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="businessQuery" className="mb-2 block text-sm font-medium">
                  Business name or Google Maps URL
                </Label>
                <Input
                  id="businessQuery"
                  name="businessQuery"
                  placeholder="e.g. BurgerMat, Madrid or https://maps.google.com/..."
                  value={businessQuery}
                  onChange={(e) => setBusinessQuery(e.target.value)}
                  className="bg-slate-950/50 border-slate-700"
                />
              </div>

              <div>
                <Label htmlFor="city" className="mb-2 block text-sm font-medium">
                  City (optional)
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-slate-950/50 border-slate-700"
                />
              </div>

              <div>
                <Label htmlFor="category" className="mb-2 block text-sm font-medium">
                  Category (optional)
                </Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g. Italian restaurant, dental clinic"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-950/50 border-slate-700"
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950/50 border-slate-700"
                />
              </div>

              {error && (
                <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Button
                  type="submit"
                  disabled={isLoading || !businessQuery.trim() || !email.trim()}
                  className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-slate-950 hover:brightness-110"
                  size="lg"
                >
                  {isLoading ? "Running audit..." : "Run free audit"}
                </Button>
                <p className="text-xs text-center text-slate-400">
                  We will email you your audit and nothing else without your permission.
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Results section */}
        {result && (
          <div id="results-section" className="mt-12 space-y-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2">Your audit report</h2>
              <p className="text-slate-200/80">
                Here is what we found for {businessQuery}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Left card - Score */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
                <div className="text-center space-y-4">
                  <div>
                    <div className="text-5xl font-bold mb-1">
                      {result.score !== null ? result.score : "-"}
                    </div>
                    <div className="text-xl text-slate-400">/ 100</div>
                  </div>
                  <div>
                    {getScoreBadge(result.score)}
                  </div>
                  <p className="text-xs text-slate-400">
                    Higher is better. Aim for 80 or above.
                  </p>
                </div>
              </div>

              {/* Right card - Audit text */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 relative">
                <div className="absolute top-4 right-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyReport}
                    className="bg-slate-950/50 border-slate-700 text-slate-200 hover:bg-slate-800"
                  >
                    {copySuccess ? "Copied!" : "Copy report"}
                  </Button>
                </div>
                <div className="max-h-[500px] overflow-y-auto pr-2 prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.auditText}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-8 text-center">
              <p className="text-lg font-medium mb-4">
                Want automatic review replies and local content for this business?
              </p>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-400 to-pink-500 text-slate-950 hover:brightness-110"
                >
                  Create your LocalLift account
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

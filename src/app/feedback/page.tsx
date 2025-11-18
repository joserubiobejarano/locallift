"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const supabase = supabaseBrowser();
      const { data: { session } } = await supabase.auth.getSession();

      const { error } = await supabase.from("feedback").insert({
        user_id: session?.user?.id || null,
        message,
        category: category || null,
        url: typeof window !== "undefined" ? window.location.href : null,
        browser: typeof window !== "undefined" ? navigator.userAgent : null,
      });

      if (error) throw error;

      setSubmitted(true);
      setMessage("");
      setCategory("");
    } catch (err: any) {
      alert(err?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-semibold">Thank You!</h1>
              <p className="text-muted-foreground">
                Your feedback has been submitted. We appreciate your input.
              </p>
              <Button onClick={() => setSubmitted(false)}>Submit Another</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Send Feedback</CardTitle>
          <CardDescription>
            We'd love to hear your thoughts, suggestions, or report any issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Category (optional)</label>
              <Input
                placeholder="e.g., Bug report, Feature request, General feedback"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Message <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Tell us what's on your mind..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
              />
            </div>
            <Button type="submit" disabled={loading || !message.trim()}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


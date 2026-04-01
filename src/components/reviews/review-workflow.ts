export type Review = {
  google_review_id: string;
  reviewer_name?: string;
  star_rating?: number | null;
  comment?: string | null;
  status: string;
  review_update_time?: string | null;
  isSample?: boolean;
};

export type ReviewApiRow = Review & { draft_reply?: string | null };

export type ReviewWorkflow = "unanswered" | "unsaved_draft" | "draft_saved" | "posted";

export type WorkflowBadgeConfig = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  className?: string;
};

export function getReviewWorkflowDisplay(
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
        className: "text-foreground",
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

export function shouldShowTestWorkflowActions(review: Review, isDemo: boolean): boolean {
  return Boolean(review.isSample || isDemo);
}

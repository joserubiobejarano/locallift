-- Per-user auto-reply preference: when true, generated replies post to GBP; when false, saved as drafts only.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS auto_reply_all_reviews BOOLEAN NOT NULL DEFAULT false;

-- Neon Postgres schema for LocalLift (no Supabase auth schema)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  email_verified TIMESTAMPTZ,
  password_hash TEXT,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
  full_name TEXT,
  business_name TEXT,
  city TEXT,
  country TEXT,
  plan TEXT DEFAULT 'free',
  plan_type TEXT DEFAULT 'free',
  plan_status TEXT DEFAULT 'free',
  plan_current_period_end TIMESTAMPTZ,
  ai_posts_used INT DEFAULT 0,
  audits_used INT DEFAULT 0,
  usage_reset_date DATE DEFAULT (CURRENT_DATE + INTERVAL '1 month'),
  reply_tone TEXT,
  owner_name TEXT,
  contact_preference TEXT,
  auto_reply_all_reviews BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.users (id) ON DELETE CASCADE,
  status TEXT,
  price_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE VIEW public.v_user_plan AS
SELECT
  p.id AS user_id,
  p.plan AS manual_plan,
  p.plan_type,
  p.plan_status,
  p.plan_current_period_end,
  p.ai_posts_used,
  p.audits_used,
  p.usage_reset_date,
  s.status AS subscription_status,
  s.price_id,
  s.current_period_end AS subscription_current_period_end
FROM public.profiles p
LEFT JOIN public.subscriptions s ON s.user_id = p.id
  AND s.status IN ('active', 'trialing', 'past_due');

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  input JSONB NOT NULL,
  output_md TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_billing (
  user_id UUID PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gbp_connections (
  user_id UUID PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'google',
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  scope TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gbp_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users (id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  title TEXT,
  address TEXT,
  timezone TEXT,
  store_code TEXT,
  place_id TEXT,
  raw JSONB,
  connected BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, location_name)
);

CREATE TABLE IF NOT EXISTS public.automation_prefs (
  location_id UUID PRIMARY KEY REFERENCES public.gbp_locations (id) ON DELETE CASCADE,
  autosend_min_rating INT DEFAULT 4,
  approve_low_ratings BOOLEAN DEFAULT true,
  check_interval_minutes INT DEFAULT 180,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  google_review_id TEXT NOT NULL,
  reviewer_name TEXT,
  star_rating INT,
  comment TEXT,
  review_update_time TIMESTAMPTZ,
  language_code TEXT,
  reply_comment TEXT,
  reply_update_time TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, google_review_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_loc ON public.reviews (user_id, location_name);

CREATE TABLE IF NOT EXISTS public.review_replies (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  review_id BIGINT NOT NULL REFERENCES public.reviews (id) ON DELETE CASCADE,
  draft_markdown TEXT NOT NULL,
  posted BOOLEAN NOT NULL DEFAULT false,
  posted_at TIMESTAMPTZ,
  google_operation_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_review_replies_user ON public.review_replies (user_id);
CREATE INDEX IF NOT EXISTS idx_review_replies_review ON public.review_replies (review_id);

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  business_query TEXT NOT NULL,
  city TEXT,
  category TEXT,
  audit_text TEXT NOT NULL,
  score INT,
  converted BOOLEAN NOT NULL DEFAULT false,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users (id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  category TEXT,
  url TEXT,
  browser TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

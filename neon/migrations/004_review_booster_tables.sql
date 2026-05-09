CREATE TABLE IF NOT EXISTS public.followup_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  service_name TEXT,
  visited_at TIMESTAMPTZ NOT NULL,
  source TEXT DEFAULT 'manual',
  external_id TEXT,
  followup_status TEXT DEFAULT 'pending',
  followup_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_followup_visits_business_id
  ON public.followup_visits(business_id);

CREATE INDEX IF NOT EXISTS idx_followup_visits_visited_at
  ON public.followup_visits(visited_at);

CREATE INDEX IF NOT EXISTS idx_followup_visits_followup_status
  ON public.followup_visits(followup_status);

CREATE INDEX IF NOT EXISTS idx_followup_visits_followup_sent_at
  ON public.followup_visits(followup_sent_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_followup_visits_csv_dedupe
  ON public.followup_visits (
    business_id,
    lower(customer_email),
    coalesce(service_name, ''),
    visited_at
  )
  WHERE source = 'csv' AND customer_email IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.followup_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.followup_visits(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  channel TEXT DEFAULT 'email',
  subject TEXT,
  body TEXT,
  provider TEXT DEFAULT 'resend',
  provider_message_id TEXT,
  status TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_followup_messages_visit_id
  ON public.followup_messages(visit_id);

CREATE INDEX IF NOT EXISTS idx_followup_messages_business_id
  ON public.followup_messages(business_id);

CREATE TABLE IF NOT EXISTS public.followup_integration_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  source TEXT,
  event_type TEXT,
  external_id TEXT,
  raw_payload JSONB,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_followup_integration_events_dedupe
  ON public.followup_integration_events (business_id, source, external_id);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_followup_integration_events_external
  ON public.followup_integration_events (business_id, source, external_id)
  WHERE external_id IS NOT NULL;

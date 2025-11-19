-- ============ UPDATE LEADS TABLE FOR FREE AUDIT ============
-- This migration updates the leads table to match the free audit funnel requirements

-- Drop existing leads table if it exists (we'll recreate with new schema)
drop table if exists public.leads cascade;

-- Create leads table with new schema
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  business_query text not null,
  city text,
  category text,
  audit_text text not null,
  score int,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.leads enable row level security;

-- No public direct access - only service role can read/write
-- We will write to this table only using the admin client from a server route
-- No policies needed since we're using service role for all operations


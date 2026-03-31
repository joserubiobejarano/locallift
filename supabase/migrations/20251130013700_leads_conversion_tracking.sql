-- ============ ADD CONVERSION TRACKING TO LEADS TABLE ============
-- This migration adds columns to track when free-audit leads convert to paying customers

-- Add conversion tracking columns
alter table public.leads
  add column if not exists converted boolean not null default false,
  add column if not exists converted_at timestamptz null;

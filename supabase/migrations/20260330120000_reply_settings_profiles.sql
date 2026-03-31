-- Minimal review-reply defaults on profiles (per user)
alter table public.profiles
  add column if not exists reply_tone text,
  add column if not exists owner_name text,
  add column if not exists contact_preference text;

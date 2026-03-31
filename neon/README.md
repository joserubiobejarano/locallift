# Neon database migrations

Apply `migrations/001_initial.sql` to your Neon branch (SQL Editor or `psql`) before running the app.

Historical Supabase migrations under `/supabase/migrations` are kept for reference only; the canonical schema for Neon is here.

**Data migration:** If you have existing Supabase data, export `public.*` tables and load into Neon after adjusting FKs from `auth.users` to `public.users` (see project docs).

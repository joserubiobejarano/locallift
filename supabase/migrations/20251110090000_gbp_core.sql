-- ==== GOOGLE CONNECTIONS (per user) ====

create table if not exists public.gbp_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null default 'google',
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  scope text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.gbp_connections enable row level security;

create policy "gbp_connections select own"
  on public.gbp_connections for select
  using (auth.uid() = user_id);

create policy "gbp_connections insert own"
  on public.gbp_connections for insert
  with check (auth.uid() = user_id);

create policy "gbp_connections update own"
  on public.gbp_connections for update
  using (auth.uid() = user_id);

-- ==== GOOGLE LOCATIONS (per user) ====

create table if not exists public.gbp_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  location_id text not null,          -- GBP location resource name id
  title text,
  address text,
  timezone text,
  raw jsonb,                          -- full GBP payload
  connected boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, location_id)
);

alter table public.gbp_locations enable row level security;

create policy "gbp_locations select own"
  on public.gbp_locations for select
  using (auth.uid() = user_id);

create policy "gbp_locations write own"
  on public.gbp_locations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==== AUTOMATION PREFS (per location) ====

create table if not exists public.automation_prefs (
  location_id uuid primary key references public.gbp_locations(id) on delete cascade,
  autosend_min_rating int default 4,         -- auto-post replies if rating >= this
  approve_low_ratings boolean default true,  -- queue 1–3★ for approval
  check_interval_minutes int default 180,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.automation_prefs enable row level security;

create policy "automation_prefs own"
  on public.automation_prefs for all
  using (exists (select 1 from public.gbp_locations l where l.id = automation_prefs.location_id and l.user_id = auth.uid()))
  with check (exists (select 1 from public.gbp_locations l where l.id = automation_prefs.location_id and l.user_id = auth.uid()));


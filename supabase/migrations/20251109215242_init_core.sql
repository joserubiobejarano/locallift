-- ============ PROFILES ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  business_name text,
  city text,
  country text,
  plan text default 'free', -- 'free' | 'starter' | 'pro' | 'agency'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles select own"
  on public.profiles
  for select using (auth.uid() = id);

create policy "profiles insert own"
  on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles update own"
  on public.profiles
  for update using (auth.uid() = id);

-- ============ PROJECTS (CONTENT) ============
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  type text not null, -- 'blog' | 'gbp_post' | 'faq' | 'review_replies'
  input jsonb not null, -- {businessName, city, service, tone}
  output_md text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "projects select own"
  on public.projects
  for select using (auth.uid() = user_id);

create policy "projects insert own"
  on public.projects
  for insert with check (auth.uid() = user_id);

create policy "projects update own"
  on public.projects
  for update using (auth.uid() = user_id);

create policy "projects delete own"
  on public.projects
  for delete using (auth.uid() = user_id);

-- ============ SUBSCRIPTIONS (STRIPE MIRROR) ============
create table if not exists public.subscriptions (
  id text primary key,                      -- stripe subscription id
  user_id uuid references auth.users(id) on delete cascade,
  status text,
  price_id text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions select own"
  on public.subscriptions
  for select using (auth.uid() = user_id);

-- ============ VIEW: EFFECTIVE PLAN ============
create or replace view public.v_user_plan as
select
  p.id as user_id,
  p.plan as manual_plan,
  s.status,
  s.price_id
from profiles p
left join subscriptions s on s.user_id = p.id
  and s.status in ('active','trialing');

-- ============ TRIGGER: AUTO-CREATE PROFILE ============
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles(id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

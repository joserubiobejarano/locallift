-- ============ ADD PLAN FIELDS TO PROFILES ============
alter table public.profiles
  add column if not exists plan_type text default 'free', -- 'free' | 'starter'
  add column if not exists plan_status text default 'free', -- 'free' | 'active' | 'trialing' | 'past_due' | 'canceled'
  add column if not exists plan_current_period_end timestamptz,
  add column if not exists ai_posts_used int default 0,
  add column if not exists audits_used int default 0,
  add column if not exists usage_reset_date date default (current_date + interval '1 month');

-- ============ UPDATE VIEW: EFFECTIVE PLAN ============
create or replace view public.v_user_plan as
select
  p.id as user_id,
  p.plan as manual_plan,
  p.plan_type,
  p.plan_status,
  p.plan_current_period_end,
  p.ai_posts_used,
  p.audits_used,
  p.usage_reset_date,
  s.status as subscription_status,
  s.price_id,
  s.current_period_end as subscription_current_period_end
from profiles p
left join subscriptions s on s.user_id = p.id
  and s.status in ('active','trialing','past_due');

-- ============ LEADS TABLE (FOR FREE AUDIT) ============
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  query_text text,
  audit_result jsonb,
  user_agent text,
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

-- Leads are public (no auth required for free audit)
create policy "leads insert public"
  on public.leads
  for insert
  with check (true);

-- Only service role can read leads
create policy "leads select service role"
  on public.leads
  for select
  using (false); -- Only service role via admin client

-- ============ FEEDBACK TABLE ============
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  message text not null,
  category text,
  url text,
  browser text,
  created_at timestamptz default now()
);

alter table public.feedback enable row level security;

create policy "feedback insert own"
  on public.feedback
  for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "feedback select own"
  on public.feedback
  for select
  using (auth.uid() = user_id or user_id is null);

-- ============ FUNCTION: RESET USAGE MONTHLY ============
create or replace function public.reset_monthly_usage()
returns void as $$
begin
  update public.profiles
  set
    ai_posts_used = 0,
    audits_used = 0,
    usage_reset_date = (current_date + interval '1 month')
  where usage_reset_date <= current_date;
end;
$$ language plpgsql security definer;

-- ============ FUNCTION: INCREMENT USAGE ============
create or replace function public.increment_usage(
  user_id_param uuid,
  field_name text
)
returns void as $$
begin
  if field_name = 'ai_posts_used' then
    update public.profiles
    set ai_posts_used = ai_posts_used + 1
    where id = user_id_param;
  elsif field_name = 'audits_used' then
    update public.profiles
    set audits_used = audits_used + 1
    where id = user_id_param;
  end if;
end;
$$ language plpgsql security definer;


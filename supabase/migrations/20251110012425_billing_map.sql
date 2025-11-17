create table if not exists public.user_billing (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique not null,
  created_at timestamptz default now()
);

alter table public.user_billing enable row level security;

create policy "user_billing select own"
  on public.user_billing
  for select using (auth.uid() = user_id);

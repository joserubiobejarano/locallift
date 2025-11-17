-- === REVIEWS TABLE (uses location_name text, NOT a FK) ===
create table if not exists public.reviews (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  location_name text not null,                      -- e.g. "locations/123..."
  google_review_id text not null,                  -- google’s review id
  reviewer_name text,
  star_rating int,
  comment text,
  review_update_time timestamptz,
  language_code text,
  reply_comment text,
  reply_update_time timestamptz,
  status text not null default 'new',              -- new|queued|replied|skipped
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, google_review_id)
);

-- === REVIEW REPLIES TABLE (keeps FK to reviews.id) ===
create table if not exists public.review_replies (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  review_id bigint not null references public.reviews(id) on delete cascade,
  draft_markdown text not null,
  posted boolean not null default false,
  posted_at timestamptz,
  google_operation_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_reviews_user on public.reviews(user_id);
create index if not exists idx_reviews_user_loc on public.reviews(user_id, location_name);
create index if not exists idx_review_replies_user on public.review_replies(user_id);
create index if not exists idx_review_replies_review on public.review_replies(review_id);

-- RLS
alter table public.reviews enable row level security;
alter table public.review_replies enable row level security;

drop policy if exists "rev_select" on public.reviews;
drop policy if exists "rev_crud" on public.reviews;
create policy "rev_select" on public.reviews
  for select using (auth.uid() = user_id);
create policy "rev_crud" on public.reviews
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "rep_select" on public.review_replies;
drop policy if exists "rep_crud" on public.review_replies;
create policy "rep_select" on public.review_replies
  for select using (auth.uid() = user_id);
create policy "rep_crud" on public.review_replies
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- service_role bypass for server jobs
drop policy if exists "rev_service" on public.reviews;
drop policy if exists "rep_service" on public.review_replies;

create policy "rev_service" on public.reviews
  as permissive for all to public
  using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "rep_service" on public.review_replies
  as permissive for all to public
  using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

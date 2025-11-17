-- Ensure RLS is on
alter table public.gbp_connections enable row level security;

-- Remove any older policies so we don't have overlaps
drop policy if exists "gbp_conn_select_own" on public.gbp_connections;
drop policy if exists "gbp_conn_insert_own" on public.gbp_connections;
drop policy if exists "gbp_conn_update_own" on public.gbp_connections;
drop policy if exists "gbp_conn_all_service" on public.gbp_connections;

-- Normal user: can only see/write their own row
create policy "gbp_conn_select_own"
  on public.gbp_connections
  for select
  using (auth.uid() = user_id);

create policy "gbp_conn_insert_own"
  on public.gbp_connections
  for insert
  with check (auth.uid() = user_id);

create policy "gbp_conn_update_own"
  on public.gbp_connections
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service role bypass (admin client using SUPABASE_SERVICE_ROLE_KEY)
-- Note: 'to public' so the policy is considered for any role; we gate inside with auth.role()
create policy "gbp_conn_all_service"
  on public.gbp_connections
  as permissive
  for all
  to public
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

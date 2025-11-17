-- Allow service_role to insert/update/select on gbp_connections in addition to "own"

-- Uses auth.role() = 'service_role' which Supabase sets for the service key.
-- Drop existing narrowly-scoped policies if present
drop policy if exists "gbp_connections select own" on public.gbp_connections;
drop policy if exists "gbp_connections insert own" on public.gbp_connections;
drop policy if exists "gbp_connections update own" on public.gbp_connections;

-- Recreate with service_role bypass
create policy "gbp_connections select own or service"
  on public.gbp_connections
  for select
  using (auth.uid() = user_id or auth.role() = 'service_role');

create policy "gbp_connections insert own or service"
  on public.gbp_connections
  for insert
  with check (auth.uid() = user_id or auth.role() = 'service_role');

create policy "gbp_connections update own or service"
  on public.gbp_connections
  for update
  using (auth.uid() = user_id or auth.role() = 'service_role')
  with check (auth.uid() = user_id or auth.role() = 'service_role');


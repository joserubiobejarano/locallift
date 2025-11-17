-- Ensure a unique row per user (needed for ON CONFLICT)
do $$
begin
  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and indexname = 'gbp_connections_user_id_key'
  ) then
    alter table public.gbp_connections
      add constraint gbp_connections_user_id_key unique (user_id);
  end if;
end $$;

-- SECURITY DEFINER function to bypass RLS safely
create or replace function public.upsert_gbp_connection(
  p_user_id uuid,
  p_access_token text,
  p_refresh_token text,
  p_expires_at timestamptz,
  p_scope text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.gbp_connections (
    user_id, access_token, refresh_token, expires_at, scope, updated_at
  )
  values (
    p_user_id, p_access_token, p_refresh_token, p_expires_at, p_scope, now()
  )
  on conflict (user_id) do update
  set access_token = excluded.access_token,
      refresh_token = excluded.refresh_token,
      expires_at    = excluded.expires_at,
      scope         = excluded.scope,
      updated_at    = now();
end;
$$;

-- Lock down function then allow normal callers
revoke all on function public.upsert_gbp_connection(uuid, text, text, timestamptz, text) from public;
grant execute on function public.upsert_gbp_connection(uuid, text, text, timestamptz, text) to anon, authenticated, service_role;

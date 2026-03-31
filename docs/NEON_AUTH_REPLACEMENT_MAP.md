# Supabase → Neon + Auth.js replacement map

This repo-specific inventory maps former Supabase touchpoints to their replacements.

## Auth / session

| Former | Replacement |
|--------|-------------|
| `src/lib/supabase/server.ts` | `auth()` from `src/auth.ts` (NextAuth v5) |
| `src/lib/supabase/client.ts` | `next-auth/react` (`signIn`, `signOut`, `useSession`) |
| `src/lib/supabase/route.ts` | Removed (no cookie bridging) |
| `src/lib/auth.ts` | `requireUser()` uses `auth()` + redirect |
| `src/lib/auth-server.ts` | Removed; `resolveUser()` uses session only |
| `src/lib/user-from-req.ts` | Demo cookie + `auth()` session |
| `src/app/api/auth/set/route.ts` | Removed |
| `src/app/api/auth/signout/route.ts` | Optional cookie clear; primary sign-out is `signOut()` |
| `src/app/(auth)/login`, `signup`, `auth/callback` | NextAuth providers + `/api/auth/*` |

## Database (Neon + `@neondatabase/serverless`)

| Former | Replacement |
|--------|-------------|
| `src/lib/supabase/admin.ts` | `src/lib/db/neon.ts` `sql` + `src/lib/db/*.ts` helpers |
| `src/lib/supabase/as-user.ts` | Server queries with `WHERE user_id = $sessionUserId` |
| `.rpc(...)` | Raw SQL (`INSERT ... ON CONFLICT`, `UPDATE`, or `SELECT` functions optional) |
| `auth.users` FKs | `public.users(id)` (see `neon/migrations/001_initial.sql`) |

## Files updated to use Neon SQL

All former `supabaseAdmin()` / `supabaseServer()` callers under `src/app/api/**`, `src/lib/**`, and client pages that queried Supabase directly now use `sql` helpers or API routes.

## Environment

| Remove | Add |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `DATABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `AUTH_SECRET` |
| `SUPABASE_SERVICE_ROLE_KEY` | `AUTH_URL` (production) |

See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for the full list.

# Supabase to Neon Migration Decision Document

This document defines **true scope** of a full move from Supabase to Neon. It does **not** prescribe immediate migration work. Neon is Postgres hosting; leaving Supabase implies replacing **Auth**, **JWT/RLS integration**, and **Supabase-specific SQL/runtime**—not a simple DB URL swap.

---

## 1) What Would Have To Be Replaced To Fully Leave Supabase

If you fully leave Supabase, these exact pieces must be replaced:

### Auth provider and session primitives

Replace Supabase Auth flows currently used via `auth.getSession()`, `auth.getUser()`, `auth.setSession()`, `auth.signOut()` in:

- [src/lib/supabase/server.ts](../src/lib/supabase/server.ts)
- [src/lib/supabase/route.ts](../src/lib/supabase/route.ts)
- [src/lib/supabase/client.ts](../src/lib/supabase/client.ts)
- [src/lib/auth-server.ts](../src/lib/auth-server.ts)
- [src/lib/user-from-req.ts](../src/lib/user-from-req.ts)
- [src/app/api/auth/set/route.ts](../src/app/api/auth/set/route.ts)
- [src/app/api/auth/signout/route.ts](../src/app/api/auth/signout/route.ts)

You need a replacement for both **browser session persistence** and **server-side cookie/session validation**.

### DB access layer abstractions

Replace Supabase client APIs (`from()`, `rpc()`, query builder semantics) in app routes/libs using:

- [src/lib/supabase/admin.ts](../src/lib/supabase/admin.ts)
- [src/lib/supabase/as-user.ts](../src/lib/supabase/as-user.ts)
- [src/lib/usage.ts](../src/lib/usage.ts)
- [src/lib/plan-server.ts](../src/lib/plan-server.ts)
- [src/app/api/projects/route.ts](../src/app/api/projects/route.ts)
- [src/app/api/projects/[id]/route.ts](../src/app/api/projects/[id]/route.ts)
- and multiple `src/app/api/*` handlers using admin client + `user_id` filters.

Decide whether replacement is raw SQL, ORM, or query builder; then refactor all calls consistently.

### RLS / policy model

Current tenancy relies heavily on Supabase JWT-aware Postgres RLS patterns (`auth.uid()`, `auth.role() = 'service_role'`).

Policies live across migrations such as:

- [supabase/migrations/20251109215242_init_core.sql](../supabase/migrations/20251109215242_init_core.sql)
- [supabase/migrations/20251110012425_billing_map.sql](../supabase/migrations/20251110012425_billing_map.sql)
- [supabase/migrations/20251110090000_gbp_core.sql](../supabase/migrations/20251110090000_gbp_core.sql)
- [supabase/migrations/20251115193918_reviews_module_fix.sql](../supabase/migrations/20251115193918_reviews_module_fix.sql)
- [supabase/migrations/20251118212730_plan_and_usage.sql](../supabase/migrations/20251118212730_plan_and_usage.sql)

In Neon alone, these Supabase auth helpers are not natively available; you must re-implement identity-to-DB authorization plumbing (or move authz fully to app layer).

### `auth.users` dependencies and FKs

Multiple tables reference `auth.users` directly (`profiles`, `projects`, `subscriptions`, `gbp_connections`, `gbp_locations`, `reviews`, `review_replies`, `feedback`, `user_billing`).

You must introduce a new canonical users table/identity mapping and migrate all FKs and constraints accordingly.

### Profile bootstrap / triggers

Current new-user bootstrap depends on a trigger/function on the Supabase auth schema:

- `public.handle_new_user()` + trigger `on_auth_user_created` in [supabase/migrations/20251109215242_init_core.sql](../supabase/migrations/20251109215242_init_core.sql)

Must be replaced by app-level onboarding logic, auth-webhook workflow, or equivalent DB trigger on your own users table.

### RPCs / SQL functions and grants

Supabase RPC usage exists and must be ported/replaced:

- `upsert_gbp_connection` in [supabase/migrations/20251113223913_rpc_upsert_gbp_connection.sql](../supabase/migrations/20251113223913_rpc_upsert_gbp_connection.sql)
- `increment_usage` and `reset_monthly_usage` in [supabase/migrations/20251118212730_plan_and_usage.sql](../supabase/migrations/20251118212730_plan_and_usage.sql)
- App usage in [src/lib/usage.ts](../src/lib/usage.ts), [src/lib/google.ts](../src/lib/google.ts), [src/app/api/google/oauth/callback/route.ts](../src/app/api/google/oauth/callback/route.ts)

You need equivalent stored procedures or move this logic into transactional app code. (Code may reference RPCs not present in this repo’s migrations; inventory remote/prod DB before cutover.)

### Environment variables and secrets model

Replace/remove Supabase-specific env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Introduce new DB/auth env contract, rotate secrets, and update all runtime initialization code.

### Middleware/session handling contract

Even though [src/middleware.ts](../src/middleware.ts) is mostly demo logic, request auth resolution is tied to Supabase session/JWT behavior via [src/lib/user-from-req.ts](../src/lib/user-from-req.ts) and related auth routes.

You must redesign end-to-end request identity propagation (cookie or bearer, refresh behavior, sign-out invalidation, and API guard expectations).

---

## 2) Estimate the Real Migration Scope

### Size bands

| Band | What it means | This app? |
|------|----------------|-----------|
| **Small (quick refactor)** | Swap DB driver only, keep same auth model and policy surface. Typical when there are no auth-schema FKs, minimal RLS, no auth-coupled triggers/RPCs. | **No** |
| **Medium (moderate migration)** | Replace auth provider + DB client with limited RLS and few auth-coupled SQL objects. Some schema/FK and session refactors. | **No** — usage is deeper than this |
| **Large (core-infra migration / near rebuild)** | Replace auth, session handling, RLS model, `auth.users` dependencies, triggers, RPCs, and env/runtime contracts together. Coordinated schema migration, auth rollout, policy redesign, API regression hardening. | **Yes** |

### Honest classification

- This is **not** a quick refactor.
- This is **beyond moderate** because of Supabase Auth + RLS coupling and direct `auth.users` dependencies.
- It is effectively a **rebuild of core infrastructure** (authn/authz + data access contract), even if product features stay the same.

---

## 3) Safest Path For Now (MVP Fast, Launch Sooner, Migrate Later)

Recommended order of operations:

1. **Finish MVP on the current Supabase foundation** — Avoid destabilizing auth/session + billing + Google + usage tracking during feature completion.
2. **Stabilize and launch** — Ship with current architecture; fix product-critical bugs; validate real usage.
3. **Prepare migration seams (without provider switch yet)** — Thin internal interfaces for auth/session and DB access so route handlers stop importing Supabase clients directly; document SQL policy/function inventory table-by-table.
4. **Run a dedicated migration project after launch** — Design target auth (source-of-truth users table, token model, session lifecycle); then authorization (DB RLS emulation vs app-layer authz); phased cutover with parity tests and rollback.
5. **Cut over only when parity is proven** — Sign-in/session refresh/sign-out; per-user isolation; Stripe webhooks; Google sync; usage limits; profile bootstrap.

---

## Clear recommendation

**A) Finish MVP first, keep Supabase temporarily, migrate later.**

A full Neon migration **now** is a high-risk core-infrastructure rewrite that will delay launch and increase regression risk across authentication, authorization, and data integrity.

**Not recommended:** **B) Stop now and start the full Neon migration before continuing.**

---

*Scope: decision only; no Neon migration code or schema changes implied by this file.*

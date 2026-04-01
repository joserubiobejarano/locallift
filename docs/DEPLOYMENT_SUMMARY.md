# Deployment summary – LocalLift (Vercel + Neon)

This file is a **short operator reference**. Authoritative env documentation is [docs/ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md). Step-by-step setup is [docs/DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md).

## Environment variables (quick reference)

| Area | Variables |
|------|-----------|
| **Database** | `DATABASE_URL` (Neon pooled; optional `DATABASE_URL_UNPOOLED`) |
| **Auth.js** | `AUTH_SECRET`, `AUTH_URL` (production), optional `AUTH_TRUST_HOST` |
| **Google** | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (NextAuth + GBP) |
| **OpenAI** | `OPENAI_API_KEY` |
| **Stripe** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_STARTER_PRICE_ID` |
| **App** | `NEXT_PUBLIC_APP_URL` (no trailing slash) |
| **Stripe (client)** | Optional `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |

## OAuth redirect URIs (Google Cloud Console)

Register **both** for the same OAuth client:

- `{NEXT_PUBLIC_APP_URL}/api/auth/callback/google` — sign-in (NextAuth)
- `{NEXT_PUBLIC_APP_URL}/api/google/oauth/callback` — Google Business Profile connection

## Database

- Apply SQL in [neon/migrations/](../neon/migrations/) in order (`001_initial.sql`, then `002_auto_reply_profiles.sql`).
- There is **no** Supabase project or Supabase env vars for this app.

## App URL helpers

Server and client code use [src/lib/env.ts](../src/lib/env.ts) (`getServerAppUrl`, `getAppUrl`) so OAuth and redirects resolve a consistent base URL, with localhost fallback in development.

## After deploy

1. Confirm `NEXT_PUBLIC_APP_URL` and `AUTH_URL` match the live origin.
2. Confirm Google redirect URIs and Stripe webhook URL match the deployment.
3. Run [docs/SMOKE_TEST_CHECKLIST.md](./SMOKE_TEST_CHECKLIST.md).

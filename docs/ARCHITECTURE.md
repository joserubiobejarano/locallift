# LocalLift Architecture

Technical architecture and design decisions for LocalLift.

---

## Tech stack

### Frontend

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI**
- **Lucide React**

### Backend

- **Next.js API Routes** – server logic, webhooks, integrations
- **Auth.js (NextAuth v5)** – sessions, Google + credentials providers ([`src/auth.ts`](../src/auth.ts))
- **Neon Postgres** – via `@neondatabase/serverless` ([`src/lib/db/neon.ts`](../src/lib/db/neon.ts)) and small DB helpers under [`src/lib/db/`](../src/lib/db/)

### External services

- **OpenAI** – content and review-reply generation
- **Google Business Profile API** – locations, reviews, replies (separate OAuth from app login; see env docs)
- **Stripe** – subscriptions and billing

### Database migrations

- **Canonical SQL:** [`neon/migrations/`](../neon/migrations/) only. Apply files in numeric order on Neon.

---

## Project structure (high level)

```
Agent-LocalLift/
├── neon/migrations/          # Postgres schema (source of truth)
├── src/
│   ├── app/
│   │   ├── (auth)/           # login, signup
│   │   ├── (dashboard)/      # dashboard, content, reviews, audit, settings, …
│   │   ├── api/              # REST-style route handlers
│   │   └── …                 # marketing, legal, demo, free-audit, etc.
│   ├── components/           # UI and feature components
│   ├── lib/
│   │   ├── db/               # neon client + domain queries (users, gbp, …)
│   │   ├── env.ts            # app base URL helpers
│   │   ├── google.ts, stripe.ts, openai.ts, …
│   │   └── demo.ts, plan usage helpers, …
│   ├── auth.ts               # NextAuth config
│   └── middleware.ts         # demo cookie → header, route guards
├── docs/
└── public/
```

---

## Database schema (Neon)

Identity and profile data live in **`public.users`** and **`public.profiles`** (`profiles.id` = `users.id`). There is **no** `auth.users` schema from Supabase.

Core entities (see [`neon/migrations/001_initial.sql`](../neon/migrations/001_initial.sql)):

| Area | Tables / views |
|------|----------------|
| Identity | `users`, `profiles` |
| Billing | `subscriptions`, `user_billing`; view `v_user_plan` |
| Content | `projects` |
| GBP | `gbp_connections`, `gbp_locations`, `automation_prefs` |
| Reviews | `reviews`, `review_replies` |
| Growth | `leads`, `feedback` |

`profiles` includes plan fields, usage counters (`ai_posts_used`, `audits_used`, `usage_reset_date`), reply tone fields, and **`auto_reply_all_reviews`** (toggle for auto-post vs draft-only behavior; see also `002_auto_reply_profiles.sql`).

---

## Authentication flow

### Email / password

1. User registers via [`POST /api/auth/register`](../src/app/api/auth/register/route.ts) (hashed password in `users.password_hash`).
2. NextAuth **Credentials** provider validates via [`findUserByEmail`](../src/lib/db/users.ts).
3. Session is cookie-based (Auth.js defaults).

### Google (app login)

1. User chooses “Continue with Google” → NextAuth Google provider.
2. On first OAuth sign-in, [`ensureUserFromOAuth`](../src/lib/db/users.ts) creates/links `users` (+ profile as needed).
3. Callback is handled by NextAuth at **`/api/auth/callback/google`** (not a legacy `/auth/callback` page).

### Session usage

- **Server:** `auth()` from Auth.js / wrappers in server components and API routes.
- **Client:** `next-auth/react` (`signIn`, `signOut`, `useSession`) where needed.

### Google Business Profile

GBP uses the **same** Google OAuth client but a **separate** redirect URI and token storage in `gbp_connections` (see [`src/lib/google.ts`](../src/lib/google.ts) and GBP API routes).

---

## Authorization and security

- **No Postgres RLS** in this stack. Access control is enforced in **application code**: API routes resolve the current user from the session and scope queries with `user_id` (or equivalent).
- **Secrets** only in server env vars; never expose `DATABASE_URL`, `AUTH_SECRET`, Stripe secrets, or refresh tokens to the client.
- **Middleware** adds demo behavior via `ll_demo` cookie → `x-demo` header; demo requests must not hit real Google/DB where routes are mocked.
- **TLS** and secure cookies in production are assumed via hosting (e.g. Vercel) and Auth.js configuration.

---

## API routes (overview)

Typical groups under `src/app/api/`:

- **`/api/auth/*`** – NextAuth `[...nextauth]`, `register`, `signout`
- **`/api/openai/*`** – generate content, review replies
- **`/api/google/*`** – GBP OAuth, connection, locations, review sync, post replies, disconnect
- **`/api/stripe/*`** – checkout, webhook, customer portal
- **`/api/reviews/*`**, **`/api/projects/*`**, **`/api/dashboard/*`**, **`/api/audit/*`**, **`/api/leads`**, **`/api/settings/*`**, etc.

Each handler should validate input, authenticate (except public endpoints), and return consistent JSON errors.

---

## Product flows (summary)

### Content generation

User submits form → OpenAI → result stored in `projects` (with usage limits enforced per plan).

### Reviews

Manual entry and/or GBP sync → drafts and posted state tracked on `reviews` / `review_replies`; posting to Google uses stored GBP tokens.

### Billing

Stripe Checkout → webhook updates `subscriptions` / profile plan fields; customer portal for self-service.

---

## Deployment

- Host the Next.js app (e.g. Vercel).
- Point `DATABASE_URL` at Neon; run migrations from `neon/migrations/`.
- Set `AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the live origin so OAuth works.

---

## Future considerations

- Automated tests (integration/E2E) for auth, billing, and GBP flows.
- Optional workflow engine (e.g. n8n) for scheduled sync — not required for core app operation.
- Observability (structured logging, error tracking) for production.

---

**Last updated:** April 2026

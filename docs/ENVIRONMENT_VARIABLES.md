# Environment Variables for LocalLift

## Database (Neon Postgres)

### `DATABASE_URL`

- **Type**: Server-only
- **Description**: Neon connection string (use the **pooled** connection for serverless/Vercel when available).
- **Example**: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

### `DATABASE_URL_UNPOOLED` (optional)

- **Type**: Server-only
- **Description**: Direct / unpooled URL for migrations or long-running clients.

**Schema upgrades:** Apply new SQL files under `neon/migrations/` in order (e.g. `002_auto_reply_profiles.sql` adds `profiles.auto_reply_all_reviews` for the Settings auto-reply toggle). If this column is missing, `/api/settings/reply` and review automation will error until the migration is run.

## Auth.js (NextAuth v5)

### `AUTH_SECRET`

- **Type**: Server-only
- **Description**: Secret for signing cookies / JWT. Generate with `openssl rand -base64 32`.
- **Vercel**: set in project env settings.

### `AUTH_URL` (recommended in production)

- **Type**: Server-only (some hosts)
- **Description**: Canonical public URL of **this Next.js app** (e.g. `https://app.example.com` or `http://localhost:3000` locally). Auth.js uses it to resolve OAuth callbacks and may rewrite middleware request URLs.
- **Important**: Must be your app’s origin, **not** a Neon database host or Neon Auth URL. If `AUTH_URL` points at the wrong host, sessions and redirects break locally (e.g. login redirects go to the wrong domain). For local dev, set `AUTH_URL=http://localhost:3000` (same as `NEXT_PUBLIC_APP_URL`).

### `AUTH_TRUST_HOST` (optional)

- **Type**: Server-only
- **Description**: Set to `true` behind some proxies if Auth.js warns about untrusted hosts.

**Google OAuth (login):** In Google Cloud Console, add **Authorized redirect URI**:

`{NEXT_PUBLIC_APP_URL}/api/auth/callback/google`

## Google (Business Profile OAuth)

### `GOOGLE_CLIENT_ID`

- **Type**: Server-only (also used by NextAuth Google provider)

### `GOOGLE_CLIENT_SECRET`

- **Type**: Server-only

**GBP redirect URI**: `{NEXT_PUBLIC_APP_URL}/api/google/oauth/callback`

### Google Cloud Console checklist (same OAuth client as login)

Use **one** Web application OAuth client for both NextAuth and GBP. Under **Authorized redirect URIs**, register **both** URLs exactly (scheme, host, port, path — no query string):

| Flow | Redirect URI (local example) |
|------|------------------------------|
| Sign-in (NextAuth) | `http://localhost:3000/api/auth/callback/google` |
| Connect GBP | `http://localhost:3000/api/google/oauth/callback` |

- Set `NEXT_PUBLIC_APP_URL` **without** a trailing slash (e.g. `http://localhost:3000`). The app normalizes trailing slashes server-side, but the value should still match what you register in Google Cloud.
- If Google shows a generic error and you never return to the app, compare the `redirect_uri` sent in the authorize request to your Console list — a mismatch is the most common cause.

**Inspect the runtime GBP redirect URI (logged-in session):** open `GET /api/google/oauth/start?debug=1` while signed in. The JSON includes `appBaseUrl`, `redirectUri`, and `redirect` (full Google URL). Ensure `redirectUri` is listed in **Authorized redirect URIs**.

## OpenAI

### `OPENAI_API_KEY`

- **Type**: Server-only

## Stripe

### `STRIPE_SECRET_KEY`

- **Type**: Server-only

### `STRIPE_WEBHOOK_SECRET`

- **Type**: Server-only

### `STRIPE_STARTER_PRICE_ID`

- **Type**: Server-only
- **Description**: Stripe Price ID for `/api/stripe/checkout`.

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (optional)

- **Type**: Client

## App URLs

### `NEXT_PUBLIC_APP_URL`

- **Type**: Client (NEXT_PUBLIC_)
- **Local**: `http://localhost:3000` (no trailing slash)
- **Server behavior**: Trailing slashes are stripped when building OAuth and server redirects so paths like `/api/google/oauth/callback` are never doubled.

## Removed (Supabase)

Do **not** set these anymore:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

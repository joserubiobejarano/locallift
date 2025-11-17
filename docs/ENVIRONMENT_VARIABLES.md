# Environment Variables for LocalLift

## Supabase

### `NEXT_PUBLIC_SUPABASE_URL`
- **Type**: Client (NEXT_PUBLIC_)
- **Vercel Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Description**: Your Supabase project URL
- **Example**: `https://xxxxx.supabase.co`

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Type**: Client (NEXT_PUBLIC_)
- **Vercel Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description**: Supabase anonymous/public key (safe to expose to client)
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### `SUPABASE_SERVICE_ROLE_KEY`
- **Type**: Server-only
- **Vercel Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Description**: Supabase service role key (admin access, NEVER expose to client)
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## OpenAI

### `OPENAI_API_KEY`
- **Type**: Server-only
- **Vercel Name**: `OPENAI_API_KEY`
- **Description**: OpenAI API key for content generation and review replies
- **Example**: `sk-...`

## Google

### `GOOGLE_CLIENT_ID`
- **Type**: Server-only
- **Vercel Name**: `GOOGLE_CLIENT_ID`
- **Description**: Google OAuth client ID for Google Business Profile integration
- **Example**: `xxxxx.apps.googleusercontent.com`

### `GOOGLE_CLIENT_SECRET`
- **Type**: Server-only
- **Vercel Name**: `GOOGLE_CLIENT_SECRET`
- **Description**: Google OAuth client secret
- **Example**: `GOCSPX-xxxxx`

## Stripe

### `STRIPE_SECRET_KEY`
- **Type**: Server-only
- **Vercel Name**: `STRIPE_SECRET_KEY`
- **Description**: Stripe secret key for API operations
- **Example**: `sk_live_...` or `sk_test_...`

### `STRIPE_WEBHOOK_SECRET`
- **Type**: Server-only
- **Vercel Name**: `STRIPE_WEBHOOK_SECRET`
- **Description**: Stripe webhook signing secret for verifying webhook events
- **Example**: `whsec_...`

### `STRIPE_PRICE_STARTER`
- **Type**: Server-only
- **Vercel Name**: `STRIPE_PRICE_STARTER`
- **Description**: Stripe price ID for the starter subscription plan (optional, used in settings page)
- **Example**: `price_xxxxx`

## App URLs

### `NEXT_PUBLIC_APP_URL`
- **Type**: Client (NEXT_PUBLIC_)
- **Vercel Name**: `NEXT_PUBLIC_APP_URL`
- **Description**: Base URL of your application (used for OAuth redirects, Stripe callbacks, etc.)
- **Local**: `http://localhost:3000`
- **Vercel Staging**: `https://locallift-staging.vercel.app` (or your actual Vercel domain)
- **Note**: The code includes a fallback to `http://localhost:3000` if not set, but you should set this explicitly in Vercel


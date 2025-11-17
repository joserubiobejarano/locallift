# Deployment Summary - LocalLift to Vercel

## 1. Environment Variables Summary

All environment variables are documented in `docs/ENVIRONMENT_VARIABLES.md`. Here's the quick reference:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` (Client) - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Client) - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` (Server-only) - Supabase service role key

### OpenAI
- `OPENAI_API_KEY` (Server-only) - OpenAI API key

### Google
- `GOOGLE_CLIENT_ID` (Server-only) - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` (Server-only) - Google OAuth client secret

### Stripe
- `STRIPE_SECRET_KEY` (Server-only) - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` (Server-only) - Stripe webhook signing secret
- `STRIPE_PRICE_STARTER` (Server-only) - Stripe price ID (optional)

### App URLs
- `NEXT_PUBLIC_APP_URL` (Client) - Base URL of your application
  - Local: `http://localhost:3000`
  - Vercel: `https://locallift-staging.vercel.app` (or your actual domain)

## 2. Code Changes Made

### Created New Files

1. **`src/lib/env.ts`** - Utility functions for getting app URL
   - `getAppUrl()` - Works on both client and server, falls back to localhost:3000
   - `getServerAppUrl()` - Server-side only, uses env var or localhost fallback

2. **`docs/ENVIRONMENT_VARIABLES.md`** - Complete documentation of all env vars

3. **`docs/DEPLOYMENT_CHECKLIST.md`** - Step-by-step deployment guide

4. **`docs/SMOKE_TEST_CHECKLIST.md`** - Post-deployment testing checklist

### Updated Files

1. **`src/lib/google.ts`**
   - Changed: `process.env.NEXT_PUBLIC_APP_URL` → `getServerAppUrl()`
   - Lines: 11, 27

2. **`src/app/api/google/oauth/start/route.ts`**
   - Changed: `process.env.NEXT_PUBLIC_APP_URL` → `getServerAppUrl()`
   - Line: 11

3. **`src/app/api/google/oauth/callback/route.ts`**
   - Changed: `process.env.NEXT_PUBLIC_APP_URL` → `getServerAppUrl()`
   - Line: 33

4. **`src/app/api/stripe/checkout/route.ts`**
   - Changed: `process.env.NEXT_PUBLIC_APP_URL` → `getServerAppUrl()`
   - Removed: Error check for missing env var (now has fallback)
   - Lines: 13

5. **`src/app/api/stripe/portal/route.ts`**
   - Changed: `process.env.NEXT_PUBLIC_APP_URL` → `getServerAppUrl()`
   - Removed: Error check for missing env var (now has fallback)
   - Lines: 9

6. **`src/app/(auth)/login/page.tsx`**
   - Changed: `process.env.NEXT_PUBLIC_APP_URL` → `getAppUrl()`
   - Line: 56

7. **`src/app/(auth)/signup/page.tsx`**
   - Changed: `process.env.NEXT_PUBLIC_APP_URL` → `getAppUrl()`
   - Line: 54

## 3. Supabase Auth Callback Configuration

### Callback Path
The app uses `/auth/callback` as the Supabase OAuth callback path.

**File**: `src/app/auth/callback/page.tsx` (already exists)

### Supabase Dashboard Configuration

In your Supabase project dashboard, you need to add these redirect URLs:

1. Go to **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://locallift-staging.vercel.app/auth/callback` (your Vercel staging URL)
   - `https://your-production-domain.com/auth/callback` (if you have a custom domain)

3. Set **Site URL** to: `https://locallift-staging.vercel.app` (or your Vercel domain)

### Google OAuth Callback

The app also uses Google OAuth for Google Business Profile integration:

**Path**: `/api/google/oauth/callback`

**Google Cloud Console Configuration**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   - `http://localhost:3000/api/google/oauth/callback`
   - `https://locallift-staging.vercel.app/api/google/oauth/callback`

## 4. Hardcoded URL Changes

### Files Changed (No hardcoded localhost URLs found)

The codebase was already using `process.env.NEXT_PUBLIC_APP_URL` in most places. The changes made were:

1. **Added fallback support**: All places now use utility functions that fall back to `http://localhost:3000` if the env var is not set
2. **Consistent usage**: Standardized on using `getAppUrl()` for client components and `getServerAppUrl()` for server-side code

### Files That Were Updated (for consistency and fallback support)

- `src/lib/google.ts` - 2 occurrences
- `src/app/api/google/oauth/start/route.ts` - 1 occurrence
- `src/app/api/google/oauth/callback/route.ts` - 1 occurrence
- `src/app/api/stripe/checkout/route.ts` - 1 occurrence
- `src/app/api/stripe/portal/route.ts` - 1 occurrence
- `src/app/(auth)/login/page.tsx` - 1 occurrence
- `src/app/(auth)/signup/page.tsx` - 1 occurrence

**Total**: 8 occurrences updated

## 5. Next Steps

1. **Review the deployment checklist**: See `docs/DEPLOYMENT_CHECKLIST.md`
2. **Set up environment variables in Vercel**: Follow the checklist
3. **Configure Supabase redirects**: Add your Vercel domain to Supabase dashboard
4. **Configure Google OAuth**: Add your Vercel domain to Google Cloud Console
5. **Test build locally**: Run `npm run build` before deploying
6. **Deploy to Vercel**: Follow the deployment checklist
7. **Run smoke tests**: Use `docs/SMOKE_TEST_CHECKLIST.md` after deployment

## 6. Important Notes

- The app will work on both `localhost:3000` and your Vercel domain automatically
- The utility functions provide fallbacks, so the app won't break if `NEXT_PUBLIC_APP_URL` is not set locally
- For production/staging, you **must** set `NEXT_PUBLIC_APP_URL` in Vercel environment variables
- After first deploy, update `NEXT_PUBLIC_APP_URL` with your actual Vercel domain and redeploy
- All OAuth redirect URIs must match exactly (including protocol and trailing slashes)

## 7. Testing Before Deploy

Run these commands locally to ensure everything builds:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# If build succeeds, you're ready to deploy!
```

If the build fails, fix any errors before deploying to Vercel.


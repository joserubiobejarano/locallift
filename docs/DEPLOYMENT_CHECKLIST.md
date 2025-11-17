# Vercel Deployment Checklist for LocalLift

## Prerequisites

- [ ] GitHub repository is set up and all code is committed
- [ ] You have a Vercel account (sign up at https://vercel.com if needed)
- [ ] You have access to your Supabase project dashboard
- [ ] You have your API keys ready (OpenAI, Google, Stripe)

## Step 1: Connect GitHub Repository to Vercel

1. [ ] Go to https://vercel.com/dashboard
2. [ ] Click "Add New..." → "Project"
3. [ ] Import your GitHub repository (`local-lift`)
4. [ ] Select the repository and click "Import"
5. [ ] Vercel will auto-detect Next.js settings (framework preset: Next.js)

## Step 2: Configure Build Settings

1. [ ] **Framework Preset**: Should be "Next.js" (auto-detected)
2. [ ] **Root Directory**: Leave as `.` (root)
3. [ ] **Build Command**: `npm run build` (default)
4. [ ] **Output Directory**: `.next` (default)
5. [ ] **Install Command**: `npm install` (default)
6. [ ] **Node.js Version**: 18.x or 20.x (recommended)

## Step 3: Add Environment Variables in Vercel

Go to **Settings** → **Environment Variables** and add the following:

### Supabase (Required)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anonymous key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key (keep secret!)

### OpenAI (Required)
- [ ] `OPENAI_API_KEY` = Your OpenAI API key (starts with `sk-`)

### Google (Required for GBP features)
- [ ] `GOOGLE_CLIENT_ID` = Your Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` = Your Google OAuth client secret

### Stripe (Required for billing)
- [ ] `STRIPE_SECRET_KEY` = Your Stripe secret key (use test key for staging: `sk_test_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` = Your Stripe webhook signing secret (get from Stripe dashboard)
- [ ] `STRIPE_PRICE_STARTER` = Your Stripe price ID for starter plan (optional)

### App URL (Required)
- [ ] `NEXT_PUBLIC_APP_URL` = Your Vercel deployment URL
  - For staging: `https://locallift-staging.vercel.app` (or your actual Vercel domain)
  - **Important**: After first deploy, Vercel will give you a URL. Update this env var and redeploy.

### Environment Variable Settings
- [ ] Set all variables for **Production**, **Preview**, and **Development** environments
- [ ] For `NEXT_PUBLIC_APP_URL`, you may want different values per environment:
  - Production: Your production domain
  - Preview: Use Vercel's preview URL (or leave as staging URL)
  - Development: `http://localhost:3000`

## Step 4: Configure Supabase Auth Redirects

1. [ ] Go to your Supabase project dashboard
2. [ ] Navigate to **Authentication** → **URL Configuration**
3. [ ] Add the following to **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://locallift-staging.vercel.app/auth/callback` (your Vercel staging URL)
   - `https://your-production-domain.com/auth/callback` (if you have a custom domain)
4. [ ] Set **Site URL** to your staging URL: `https://locallift-staging.vercel.app`
5. [ ] Save changes

## Step 5: Configure Google OAuth Redirect URI

1. [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
2. [ ] Navigate to **APIs & Services** → **Credentials**
3. [ ] Find your OAuth 2.0 Client ID
4. [ ] Click **Edit**
5. [ ] Add to **Authorized redirect URIs**:
   - `https://locallift-staging.vercel.app/api/google/oauth/callback`
   - `http://localhost:3000/api/google/oauth/callback` (for local dev)
6. [ ] Save changes

## Step 6: Configure Stripe Webhook

1. [ ] Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. [ ] Navigate to **Developers** → **Webhooks**
3. [ ] Click **Add endpoint**
4. [ ] Set **Endpoint URL** to: `https://locallift-staging.vercel.app/api/stripe/webhook`
5. [ ] Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. [ ] Click **Add endpoint**
7. [ ] Copy the **Signing secret** (starts with `whsec_`)
8. [ ] Add this as `STRIPE_WEBHOOK_SECRET` in Vercel environment variables
9. [ ] Redeploy if needed

## Step 7: Test Build Locally

Before deploying, test the build locally:

```bash
# Install dependencies
npm install

# Run build
npm run build

# Fix any build errors
# Common issues:
# - Missing environment variables (check .env.local)
# - TypeScript errors
# - Import errors
```

- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No missing dependencies

## Step 8: Deploy to Vercel

1. [ ] Click **Deploy** in Vercel dashboard
2. [ ] Wait for build to complete
3. [ ] Check build logs for any errors
4. [ ] If build fails, check:
   - Environment variables are set correctly
   - All dependencies are in `package.json`
   - No syntax errors in code

## Step 9: Update Environment Variables After First Deploy

After the first deploy, Vercel will give you a deployment URL:

1. [ ] Copy your Vercel deployment URL (e.g., `https://locallift-staging-xxxxx.vercel.app`)
2. [ ] Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
3. [ ] Update Supabase redirect URLs with the actual Vercel URL
4. [ ] Update Google OAuth redirect URI with the actual Vercel URL
5. [ ] Update Stripe webhook URL with the actual Vercel URL
6. [ ] Redeploy (trigger a new deployment)

## Step 10: Verify Deployment

- [ ] Visit your Vercel deployment URL
- [ ] Check that the homepage loads
- [ ] Run the smoke tests (see `SMOKE_TEST_CHECKLIST.md`)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `package.json` has all dependencies
- Check for TypeScript errors: `npm run build` locally

### Auth Redirects Not Working
- Verify Supabase redirect URLs include your Vercel domain
- Check that `NEXT_PUBLIC_APP_URL` matches your Vercel domain
- Clear browser cache and cookies

### API Routes Return 500
- Check Vercel function logs
- Verify server-side environment variables are set
- Check that API keys are valid

### OAuth Flows Fail
- Verify redirect URIs match exactly (including protocol and trailing slashes)
- Check that OAuth client IDs/secrets are correct
- Ensure callback URLs are whitelisted in provider dashboards


# Vercel Deployment Checklist for LocalLift

## Prerequisites

- [ ] GitHub repository is set up and all code is committed
- [ ] You have a Vercel account (sign up at https://vercel.com if needed)
- [ ] Neon project created and `DATABASE_URL` (pooled) available
- [ ] You have your API keys ready (OpenAI, Google, Stripe)

## Step 1: Connect GitHub Repository to Vercel

1. [ ] Go to https://vercel.com/dashboard
2. [ ] Click "Add New..." → "Project"
3. [ ] Import your GitHub repository
4. [ ] Select the repository and click "Import"
5. [ ] Vercel will auto-detect Next.js settings (framework preset: Next.js)

## Step 2: Configure Build Settings

1. [ ] **Framework Preset**: Should be "Next.js" (auto-detected)
2. [ ] **Root Directory**: Leave as `.` (root)
3. [ ] **Build Command**: `npm run build` (default)
4. [ ] **Output Directory**: `.next` (default)
5. [ ] **Install Command**: `npm install` (default)
6. [ ] **Node.js Version**: 20.x (recommended; 18+ supported)

## Step 3: Add Environment Variables in Vercel

Go to **Settings** → **Environment Variables**. Full descriptions: [docs/ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md).

### Database (required)

- [ ] `DATABASE_URL` = Neon pooled connection string (`postgresql://...?sslmode=require`)

### Auth.js / NextAuth (required)

- [ ] `AUTH_SECRET` = Random secret (e.g. `openssl rand -base64 32`)
- [ ] `AUTH_URL` = Public origin of this app on that environment (e.g. `https://your-app.vercel.app` or `http://localhost:3000` for local)

### Google (required for sign-in + GBP)

- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`

### OpenAI (required for AI features)

- [ ] `OPENAI_API_KEY`

### Stripe (required for billing)

- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_STARTER_PRICE_ID` = Price ID used by checkout

### App URL (required)

- [ ] `NEXT_PUBLIC_APP_URL` = Same canonical origin as the app (no trailing slash), e.g. your Vercel URL

### Optional

- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `DATABASE_URL_UNPOOLED` for admin/migration tools
- [ ] `AUTH_TRUST_HOST=true` if Auth.js warns about the host behind a proxy

### Environment scope

- [ ] Set variables for **Production**, **Preview**, and/or **Development** as needed
- [ ] For preview deploys, ensure `AUTH_URL` / `NEXT_PUBLIC_APP_URL` match the preview URL or your chosen stable staging URL

## Step 4: Neon schema

1. [ ] In Neon, run `neon/migrations/001_initial.sql`, then `002_auto_reply_profiles.sql`, in order (SQL Editor or `psql`)

## Step 5: Google Cloud OAuth redirect URIs

Use **one** Web application OAuth client for NextAuth **and** GBP (see [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)).

1. [ ] [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**
2. [ ] **Authorized redirect URIs** must include exactly:
   - `{NEXT_PUBLIC_APP_URL}/api/auth/callback/google`
   - `{NEXT_PUBLIC_APP_URL}/api/google/oauth/callback`
3. [ ] Repeat for local dev origins if you test locally (`http://localhost:3000/...`)

## Step 6: Stripe webhook

1. [ ] Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. [ ] URL: `https://your-deployment.vercel.app/api/stripe/webhook`
3. [ ] Events: subscription lifecycle events your webhook handler expects (`customer.subscription.*`, etc.)
4. [ ] Copy signing secret → `STRIPE_WEBHOOK_SECRET` in Vercel

## Step 7: Test build locally

```bash
npm install
npm run build
```

- [ ] Build completes successfully
- [ ] No TypeScript errors

## Step 8: Deploy to Vercel

1. [ ] Deploy from the dashboard or via git push
2. [ ] Fix any build errors using Vercel logs

## Step 9: After first deploy

1. [ ] Set `NEXT_PUBLIC_APP_URL` and `AUTH_URL` to the real deployment URL if they were placeholders
2. [ ] Add the same URLs to Google OAuth redirect URIs
3. [ ] Update Stripe webhook URL if the domain changed
4. [ ] Redeploy if env vars changed

## Step 10: Verify

- [ ] Open the deployment URL; homepage loads
- [ ] Run [docs/SMOKE_TEST_CHECKLIST.md](./SMOKE_TEST_CHECKLIST.md)

## Troubleshooting

### Build fails

- Check Vercel build logs, `npm run build` locally, and required env vars

### Auth / OAuth redirects fail

- `AUTH_URL` and `NEXT_PUBLIC_APP_URL` must match the browser origin
- Google redirect URIs must match exactly (scheme, host, port, path)

### API 500s

- Vercel function logs; verify `DATABASE_URL` and server-only secrets on that environment

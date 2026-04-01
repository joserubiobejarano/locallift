# LocalLift

**Your AI-powered platform for local business growth**

LocalLift is an AI-powered platform for local businesses and agencies. It helps them generate local SEO content, reply to customer reviews with AI, audit and optimize Google Business Profiles, and manage everything from one dashboard.

---

## 🎯 What LocalLift Does

LocalLift helps local businesses:

- **Generate local SEO content** (blogs, GBP posts, FAQs) with hyper-local focus
- **Reply to reviews** (manually & via AI) across multiple platforms
- **Connect to Google Business Profile** to sync locations and reviews
- **Run free profile audits** via a dedicated landing page for lead generation
- **Manage everything in one dashboard** (Content / Reviews / Audit / Settings)

---

## ✨ Current Features (Production-Ready)

### 🔐 Authentication System
- Email/password signup and login
- Google OAuth for app access (Auth.js / NextAuth v5)
- Secure cookie-based sessions
- User records in Postgres (`public.users`) with profiles
- Registration and sign-out API routes

### 📝 Content Generator
- **Blog posts** – Hyper-local, neighborhood-focused
- **GBP posts** – Ready-to-publish ideas and drafts
- **FAQs** – Based on local context
- **Local SEO AI Agent** – Business + location aware
- **Usage limits** – 20 posts/month (LocalLift Starter)
- **Project history** – Save and manage all generated content

### ⭐ Review Management
- **Manual review entry** – Any platform (Google, Yelp, TripAdvisor, etc.)
- **AI reply generation** – Context-aware, professional responses
- **Unlimited replies** – No limits on review responses
- **Review history** – Track all reviews and replies
- **Platform-specific tones** – Adjust tone per platform
- **GBP** – Location selector, sync, drafts/posting workflow (see Settings for auto-reply toggle)

### 🔍 Profile Audit Tool
- **AI-powered audits** – Comprehensive GBP analysis
- **Free audit landing page** – `/free-audit` for lead generation
- **Visual reports** – Scoring, priorities, actionable recommendations
- **Lead capture** – Email collection for prospects (with conversion tracking)
- **Demo version** – Available in demo mode

### 🎭 Demo Mode
- **Dedicated `/demo` route** – Live demo with sample reviews (sets `ll_demo` cookie for sandbox API behavior when not logged in)
- **Cookie** – `ll_demo` cookie (no `?demo=1` query flag)
- **Middleware** – Injects `x-demo` header; blocks OAuth and auth APIs in demo
- **Fake data** – Sample reviews, locations, audits, usage metrics
- **Full functionality** – Generate content and replies in sandbox (with limits)
- **No GBP required** – Perfect for demos and testing

### 💳 Billing & Subscription (Stripe)
- **Single plan** – LocalLift Starter at $14.99/month
- **7-day free trial** – No credit card required
- **Usage limits** – 20 posts/month, 5 audits/month, unlimited replies
- **Customer portal** – Manage subscription, payment methods
- **Plan gating** – Enforce limits, upgrade prompts (UpgradeBanner, UpgradeModal, PlanGate)

### 🔌 Google Business Profile Integration
- **OAuth connection** – Secure GBP account linking (separate redirect from app login)
- **Connection status** – `GET /api/google/connection`
- **Location syncing** – `POST /api/google/locations/sync`; list endpoints for UI
- **Review syncing** – Pull reviews from GBP
- **Reply posting** – Post replies directly to GBP (when enabled / plan allows)
- **Token management** – Automatic token refresh
- **Disconnect** – `POST /api/google/disconnect` and UI control
- **Settings** – Locations list, reply tone, auto-reply-all toggle, sync actions

### 📊 Dashboard & Metrics
- **Overview** – 2×2 grid: reviews this month, content this month, audits this month, usage (posts/audits used vs limit)
- **Dashboard summary API** – `GET /api/dashboard/summary`
- **Usage tracking** – Monthly reset; demo mode shows sample metrics

### 🏠 Marketing & Legal
- **Homepage** – Hero, features, FAQ, testimonials, CTA
- **Pricing page** – `/pricing` with plan details and CTA
- **Footer** – Links to legal, contact, feedback
- **Legal** – `/legal`, `/privacy`, `/terms`, `/contact`, `/feedback`

### 🏗️ Infrastructure
- **Next.js 16** with App Router
- **React 19**, TypeScript
- **Neon Postgres** – Serverless driver; schema in `neon/migrations/`
- **Auth.js (NextAuth v5)** – Authentication
- **Stripe** – Payment processing
- **OpenAI** – GPT-4o-mini with custom local SEO agent
- **Middleware** – Demo mode detection and header injection

---

## 📊 Usage Limits (Current)

| Plan   | AI posts/month | Audits/month | Review replies |
|--------|----------------|--------------|----------------|
| Free   | Gated          | Gated        | Gated          |
| Starter| 20             | 5            | Unlimited      |

- Limits enforced in API and UI; monthly reset via `usage_reset_date` on profiles.
- Future tiers (Pro, Agency) are planned; see [docs/ROADMAP.md](./docs/ROADMAP.md).

---

## 🚧 Still Pending

- **Demo mode polish** – Stricter demo limits, clearer “Post to Google” behavior in demo, signup CTA after limits (banner exists in dashboard layout; tune copy/limits).
- **Audit funnel** – Layout and CTA on free-audit results, social proof, conversion optimization.
- **Dashboard analytics** – Trend cards (vs last month), simple charts (e.g. usage over time).
- **Plan gating verification** – Ensure posting, content, and audit limits and upgrade CTAs are consistent everywhere.
- **Pre-launch QA** – End-to-end GBP tests (OAuth, sync, reply posting), error logging (e.g. Sentry), performance pass.
- **Marketing** – “Why LocalLift?” page, case studies, testimonials, SEO.

See [docs/NEXT_STEPS.md](./docs/NEXT_STEPS.md) and [docs/ROADMAP.md](./docs/ROADMAP.md) for full details.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- [Neon](https://neon.tech) (or compatible Postgres) and `DATABASE_URL`
- OpenAI API key
- Google Cloud project with Business Profile API enabled (for GBP features)
- Stripe account (for payments)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Agent-LocalLift
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` and set variables (see [docs/ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md)). Minimally:

```
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require

AUTH_SECRET=your_random_secret
AUTH_URL=http://localhost:3000

OPENAI_API_KEY=sk-...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

NEXT_PUBLIC_APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
```

4. Apply database migrations on Neon (SQL Editor or `psql`), **in order**:

- `neon/migrations/001_initial.sql`
- `neon/migrations/002_auto_reply_profiles.sql`

See [neon/README.md](./neon/README.md).

5. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
Agent-LocalLift/
├── neon/migrations/             # Canonical Postgres schema
├── src/
│   ├── app/
│   │   ├── (auth)/              # login, signup
│   │   ├── (dashboard)/         # dashboard, content, reviews, audit, settings
│   │   ├── api/
│   │   │   ├── auth/            # NextAuth [...nextauth], register, signout
│   │   │   ├── openai/
│   │   │   ├── google/
│   │   │   ├── stripe/
│   │   │   ├── audit/
│   │   │   ├── dashboard/
│   │   │   ├── leads/
│   │   │   ├── projects/
│   │   │   ├── reviews/
│   │   │   └── settings/
│   │   ├── demo/
│   │   ├── free-audit/
│   │   ├── pricing/
│   │   └── …                    # legal, contact, feedback, etc.
│   ├── components/
│   └── lib/                     # db (Neon), auth helpers, OpenAI, Stripe, Google, demo, plan, usage
├── docs/
└── public/
```

---

## 🗄️ Database Schema

### Core
- `users` – Accounts (email, password hash, OAuth fields)
- `profiles` – Business info, plan, usage counters, reply settings, `auto_reply_all_reviews`
- `projects` – Generated content
- `subscriptions`, `user_billing` – Stripe mirror
- `leads` – Free-audit leads (`converted`, `converted_at`)

### Google Business Profile
- `gbp_connections`, `gbp_locations`, `automation_prefs`
- `reviews`, `review_replies`

Full DDL: [`neon/migrations/001_initial.sql`](./neon/migrations/001_initial.sql).

---

## 🔒 Security

- **Application-layer authorization** – API routes use the Auth.js session and scope data by `user_id` (no Postgres RLS in this stack).
- **Dashboard routes** require a signed-in user (and respect demo mode where applicable).
- **Secrets** only in server environment variables; never commit `.env.local`.

---

## 🛣️ Roadmap

See [docs/ROADMAP.md](./docs/ROADMAP.md) for full phases and future features.

**Current status**
- ✅ **Phase 1**: Core Product (100% Complete)
- ✅ **Phase 2**: Monetization & Billing (100% Complete)
- 🚧 **Phase 3**: Google Business Profile (backend complete; UI and automation polish ongoing)

**Next steps**  
See [docs/NEXT_STEPS.md](./docs/NEXT_STEPS.md) for the developer checklist.

**Other docs**
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) – Architecture overview
- [docs/ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md) – Env reference
- [docs/DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md) – Deployment
- [docs/SMOKE_TEST_CHECKLIST.md](./docs/SMOKE_TEST_CHECKLIST.md) – Smoke tests

---

## 🧪 Development

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
npm start
```

*No test script is configured yet; see roadmap for future QA and E2E plans.*

---

## 📝 API Routes

### OpenAI
- `POST /api/openai/generate` – Generate content (blog/post/FAQ)
- `POST /api/openai/review-reply` – Generate review reply

### Google Business Profile
- `GET /api/google/oauth/start` – Start GBP OAuth flow
- `GET /api/google/oauth/callback` – GBP OAuth callback
- `GET /api/google/connection` – Connection status
- `GET /api/google/locations` – Locations payload for UI
- `GET /api/google/locations/list` – List locations
- `POST /api/google/locations/sync` – Sync locations from GBP
- `POST /api/google/reviews/sync` – Sync reviews for a location
- `POST /api/google/replies` – Post a reply to a review
- `POST /api/google/disconnect` – Disconnect Google account

### Audit
- `POST /api/audit/profile` – Run profile audit (authenticated)
- `POST /api/audit/free-profile` – Free audit (lead capture)

### Dashboard & Leads
- `GET /api/dashboard/summary` – Dashboard summary data
- `POST /api/leads` – Submit lead (e.g. free-audit)

### Reviews & settings
- `GET/POST /api/reviews` – List/create reviews (and related routes as implemented)
- `GET/PUT /api/settings/reply` – Reply profile / auto-reply preference

### Projects
- `GET/POST /api/projects` – List/create projects
- `GET /api/projects/[id]` – Get project

### Auth
- `GET/POST /api/auth/[...nextauth]` – NextAuth (sign-in callbacks, session)
- `POST /api/auth/register` – Email/password registration
- `POST /api/auth/signout` – Sign out

### Stripe
- `POST /api/stripe/checkout` – Create checkout session
- `POST /api/stripe/webhook` – Handle webhook events
- `GET /api/stripe/portal` – Redirect to customer portal

---

## 🤝 Contributing

This is currently a private project. For internal contributors:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

Proprietary – All rights reserved

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org) – React framework
- [Neon](https://neon.tech) – Serverless Postgres
- [Auth.js](https://authjs.dev) – Authentication for Next.js
- [OpenAI](https://openai.com) – AI content generation
- [Stripe](https://stripe.com) – Payment processing
- [Tailwind CSS](https://tailwindcss.com) – Styling
- [Radix UI](https://www.radix-ui.com) – UI components
- [Lucide React](https://lucide.dev) – Icons

---

## 📧 Support

For issues, questions, or feature requests, please contact the development team.

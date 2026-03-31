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
- Google OAuth for app access
- Secure session management with Supabase
- User profiles with business information
- Auth callback handling for OAuth

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

### 🔍 Profile Audit Tool
- **AI-powered audits** – Comprehensive GBP analysis
- **Free audit landing page** – `/free-audit` for lead generation
- **Visual reports** – Scoring, priorities, actionable recommendations
- **Lead capture** – Email collection for prospects (with conversion tracking)
- **Demo version** – Available in demo mode

### 🎭 Demo Mode
- **Dedicated `/demo` route** – Creates demo session and redirects to dashboard
- **Cookie + query param** – `?demo=1` or `ll_demo` cookie
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

### 🔌 Google Business Profile Integration (Backend Complete)
- **OAuth connection** – Secure GBP account linking
- **Connection status** – `GET /api/google/connection` to check if connected
- **Location syncing** – Sync all GBP locations; list via `/api/google/locations` and `/api/google/locations/list`
- **Review syncing** – Pull reviews from GBP
- **Reply posting** – Post replies directly to GBP
- **Token management** – Automatic token refresh
- **Disconnect** – `POST /api/google/disconnect`
- **UI in progress** – Settings and Reviews pages need polish (see [Still Pending](#-still-pending))

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
- **Supabase** – Auth, database, Row Level Security
- **Stripe** – Complete payment processing
- **OpenAI** – GPT-4o-mini with custom local SEO agent
- **PostgreSQL** – Robust database schema
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

- **GBP UI wiring** – Settings: show connected GBP email, list of locations, “Disconnect Google” button, auto-sync toggle. Reviews: location selector, “Sync reviews now” button, status badges, loading/error states.
- **Demo mode polish** – Top “You’re in demo mode” banner, stricter demo limits (e.g. 3 replies, 2 posts), disable “Post to Google” in demo, signup CTA after limits.
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
- Supabase account and project
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
# or
yarn install
# or
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in your environment variables (see [docs/ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md) for details):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

OPENAI_API_KEY=your_openai_api_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# Redirect URI is typically NEXT_PUBLIC_APP_URL + /api/google/oauth/callback

NEXT_PUBLIC_APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_PRICE_STARTER=price_xxxxx
```

4. Run database migrations
```bash
# Using Supabase CLI
supabase migration up
```

5. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
Agent-LocalLift/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth routes (login, signup)
│   │   ├── (dashboard)/         # Protected dashboard
│   │   │   ├── dashboard/       # Overview & usage
│   │   │   ├── content/         # Content generation
│   │   │   ├── reviews/         # Reviews management
│   │   │   ├── audit/           # Profile audit
│   │   │   └── settings/        # Settings & billing
│   │   ├── api/
│   │   │   ├── openai/          # Content & review-reply generation
│   │   │   ├── google/          # GBP OAuth, locations, reviews, replies, disconnect, connection
│   │   │   ├── stripe/          # Checkout, portal, webhook
│   │   │   ├── audit/           # Profile audit, free-profile (lead audit)
│   │   │   ├── auth/            # signout, set
│   │   │   ├── dashboard/       # summary
│   │   │   ├── leads/           # Lead capture
│   │   │   ├── projects/       # Content projects CRUD
│   │   │   └── reviews/        # Manual review CRUD
│   │   ├── demo/                # Demo mode entry
│   │   ├── free-audit/          # Free audit landing
│   │   ├── pricing/             # Pricing page
│   │   ├── feedback/            # Feedback form
│   │   ├── contact/             # Contact
│   │   ├── legal/               # Legal hub
│   │   ├── privacy/             # Privacy policy
│   │   ├── terms/               # Terms of service
│   │   └── auth/callback/       # OAuth callback
│   ├── components/              # React components (UI, marketing, UpgradeModal, etc.)
│   └── lib/                     # Utils, Supabase, auth, OpenAI, Stripe, Google, plan, usage, demo
├── supabase/
│   └── migrations/
├── docs/                        # ROADMAP, NEXT_STEPS, ARCHITECTURE, ENVIRONMENT_VARIABLES, etc.
└── public/
```

---

## 🗄️ Database Schema

### Core Tables
- `profiles` – User profiles, business info, usage counters (`ai_posts_used`, `audits_used`, `usage_reset_date`), plan fields
- `projects` – Generated content (blogs, posts, FAQs)
- `subscriptions` – Stripe subscription mirror
- `user_billing` – Billing information
- `leads` – Free-audit leads (with `converted`, `converted_at` for conversion tracking)

### Google Business Profile Tables
- `gbp_connections` – Connected Google accounts
- `gbp_locations` – Synced business locations
- `reviews` – Reviews from Google and other platforms
- `review_replies` – Generated and posted replies

---

## 🔒 Security

- Row Level Security (RLS) enabled on Supabase tables
- User authentication required for dashboard routes
- API routes protected with server-side auth (and demo checks where applicable)
- Sensitive keys in environment variables only

---

## 🛣️ Roadmap

See [docs/ROADMAP.md](./docs/ROADMAP.md) for full phases and future features.

**Current status**
- ✅ **Phase 1**: Core Product (100% Complete)
- ✅ **Phase 2**: Monetization & Billing (100% Complete)
- 🚧 **Phase 3**: Google Business Profile (backend 100%, UI ~70%)

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
- `GET /api/google/oauth/start` – Start OAuth flow
- `GET /api/google/oauth/callback` – OAuth callback
- `GET /api/google/connection` – Check if user has GBP connected
- `GET /api/google/locations` – Get connected locations
- `GET /api/google/locations/list` – List locations (for dropdowns etc.)
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

### Reviews
- `GET /api/reviews` – Get user’s reviews
- `POST /api/reviews` – Create manual review entry

### Projects
- `GET /api/projects` – List projects
- `POST /api/projects` – Create project
- `GET /api/projects/[id]` – Get project
- (Update/delete as implemented)

### Auth
- `POST /api/auth/signout` – Sign out
- `POST /api/auth/set` – Set session (e.g. post-OAuth)

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
- [Supabase](https://supabase.com) – Backend as a service
- [OpenAI](https://openai.com) – AI content generation
- [Stripe](https://stripe.com) – Payment processing
- [Tailwind CSS](https://tailwindcss.com) – Styling
- [Radix UI](https://www.radix-ui.com) – UI components
- [Lucide React](https://lucide.dev) – Icons

---

## 📧 Support

For issues, questions, or feature requests, please contact the development team.

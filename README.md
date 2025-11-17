# LocalLift

**Your AI assistant for local business profiles**

LocalLift is an AI-powered workspace for local businesses and agencies to manage their online presence, generate local SEO content, handle reviews, and optimize their Google Business Profile.

---

## 🎯 What LocalLift Does

LocalLift helps local businesses:

- **Generate local SEO content** (blogs, GBP posts, FAQs) with hyper-local focus
- **Reply to reviews** (manually & via AI) across multiple platforms
- **Connect to Google Business Profile** to sync locations and reviews
- **Manage everything in one dashboard** (Content / Reviews / Settings)

---

## ✨ Current Features

### Authentication
- Email + Google OAuth signup/login
- Secure session management with Supabase

### Dashboard
- **Overview** - Main dashboard with key metrics
- **Content** - Generate and manage local SEO content
  - Blog posts (hyper-local, neighborhood-focused)
  - Google Business Profile posts
  - FAQ generation
- **Reviews** - Manage and reply to reviews
  - Manual review entry and AI reply generation
  - Google Business Profile review sync (when connected)
- **Settings** - Account and integration management
  - Google Business Profile connection
  - Profile settings

### Content Generation
- Local SEO blog posts
- GBP post ideas and drafts
- FAQ generation based on local context
- All content emphasizes local angles (city, neighborhood, landmarks)

### Review Management
- Manual review input (any platform)
- AI-powered reply generation
- Review draft saving
- Copy-to-clipboard for easy posting

### Google Business Profile Integration
- OAuth connection
- Location syncing
- Review syncing (when connected)
- Reply posting (when connected)

### Infrastructure
- Supabase backend with Row Level Security (RLS)
- Stripe integration foundation (checkout, webhook, plans)
- OpenAI integration for content generation
- PostgreSQL database with proper schema

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
cd local-lift
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

Fill in your environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

OPENAI_API_KEY=your_openai_api_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
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
local-lift/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── (dashboard)/       # Dashboard routes (protected)
│   │   │   ├── content/       # Content generation page
│   │   │   ├── reviews/       # Reviews management page
│   │   │   ├── settings/      # Settings page
│   │   │   └── dashboard/     # Overview page
│   │   └── api/               # API routes
│   │       ├── openai/        # OpenAI content generation
│   │       ├── google/        # Google Business Profile API
│   │       ├── stripe/        # Stripe payment handling
│   │       └── reviews/       # Review management
│   ├── components/            # React components
│   │   └── ui/               # UI component library
│   └── lib/                   # Utility libraries
│       ├── supabase/         # Supabase client helpers
│       ├── auth.ts           # Authentication helpers
│       ├── openai.ts         # OpenAI client
│       ├── google.ts         # Google API client
│       └── stripe.ts         # Stripe client
├── supabase/
│   └── migrations/           # Database migrations
└── public/                   # Static assets
```

---

## 🗄️ Database Schema

### Core Tables
- `profiles` - User profiles with business information
- `projects` - Generated content (blogs, posts, FAQs)
- `subscriptions` - Stripe subscription mirror
- `user_billing` - Billing information

### Google Business Profile Tables
- `gbp_connections` - Connected Google accounts
- `gbp_locations` - Synced business locations
- `reviews` - Reviews from Google and other platforms
- `review_replies` - Generated and posted replies

---

## 🔒 Security

- Row Level Security (RLS) enabled on all Supabase tables
- User authentication required for all dashboard routes
- API routes protected with server-side auth checks
- Environment variables for sensitive keys

---

## 📊 Usage Limits

Currently under development. Future plans:
- Free tier: 10 content generations/month, 10 review replies/month
- Starter tier: 100 content generations, 100 review replies
- Pro tier: 500 content generations, 500 review replies + automation

---

## 🛣️ Roadmap

See [docs/ROADMAP.md](./docs/ROADMAP.md) for detailed development phases and future features.

**Current Phase**: Phase 1 - "Manual but powerful" MVP
- ✅ Core authentication and dashboard
- ✅ Content generation
- ✅ Manual review replies
- 🚧 Profile audit feature
- 🚧 Marketing homepage

---

## 🧪 Development

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm start
```

---

## 📝 API Routes

### OpenAI
- `POST /api/openai/generate` - Generate content (blog/post/FAQ)
- `POST /api/openai/review-reply` - Generate review reply

### Google Business Profile
- `GET /api/google/oauth/start` - Start OAuth flow
- `GET /api/google/oauth/callback` - OAuth callback
- `GET /api/google/locations` - Get connected locations
- `POST /api/google/locations/sync` - Sync locations
- `POST /api/google/reviews/sync` - Sync reviews for a location
- `POST /api/google/replies` - Post a reply to a review
- `POST /api/google/disconnect` - Disconnect Google account

### Reviews
- `GET /api/reviews` - Get user's reviews
- `POST /api/reviews` - Create manual review entry

### Stripe
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle webhook events
- `GET /api/stripe/portal` - Access customer portal

---

## 🤝 Contributing

This is currently a private project. For internal contributors:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

Proprietary - All rights reserved

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org) - React framework
- [Supabase](https://supabase.com) - Backend as a service
- [OpenAI](https://openai.com) - AI content generation
- [Stripe](https://stripe.com) - Payment processing
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Radix UI](https://www.radix-ui.com) - UI components

---

## 📧 Support

For issues, questions, or feature requests, please contact the development team.

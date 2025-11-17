# LocalLift Architecture

Technical architecture and design decisions for LocalLift.

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router) - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - Server-side logic
- **Supabase** - Backend as a service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication
  - Storage (if needed)

### External Services
- **OpenAI API** - Content generation (GPT-4)
- **Google Business Profile API** - Location and review management
- **Stripe** - Payment processing
- **n8n** (Phase 3) - Workflow automation

### Database
- **PostgreSQL** (via Supabase)
- Migrations managed in `supabase/migrations/`

---

## Project Structure

```
local-lift/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth group (public)
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/         # Dashboard group (protected)
│   │   │   ├── dashboard/       # Overview page
│   │   │   ├── content/         # Content generation
│   │   │   ├── reviews/         # Review management
│   │   │   ├── settings/        # Settings & integrations
│   │   │   └── layout.tsx       # Dashboard layout with sidebar
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # Auth endpoints
│   │   │   ├── openai/          # OpenAI integration
│   │   │   ├── google/          # Google Business Profile
│   │   │   ├── stripe/          # Stripe payments
│   │   │   ├── reviews/         # Review CRUD
│   │   │   └── projects/        # Content projects CRUD
│   │   ├── auth/                # Auth callback handler
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page (Phase 1.3)
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components
│   │   └── [feature].tsx        # Feature-specific components
│   ├── lib/                     # Utility libraries
│   │   ├── supabase/            # Supabase clients
│   │   │   ├── client.ts        # Browser client
│   │   │   ├── server.ts        # Server client
│   │   │   ├── admin.ts         # Admin client (service role)
│   │   │   └── as-user.ts       # User-scoped client
│   │   ├── auth.ts              # Auth helpers
│   │   ├── auth-server.ts       # Server-side auth
│   │   ├── openai.ts            # OpenAI client
│   │   ├── google.ts            # Google API client
│   │   ├── stripe.ts            # Stripe client
│   │   ├── user-from-req.ts     # Extract user from request
│   │   ├── utils.ts             # General utilities
│   │   └── validators.ts        # Zod schemas
│   └── middleware.ts            # Next.js middleware
├── supabase/
│   ├── migrations/              # Database migrations
│   └── config.toml              # Supabase config
├── public/                      # Static assets
└── [config files]               # Next.js, TypeScript, etc.
```

---

## Database Schema

### Core Tables

#### `profiles`
User profile and business information.
```sql
- id (uuid, PK, FK → auth.users)
- full_name (text)
- business_name (text)
- city (text)
- country (text)
- plan (text, default 'free')
- created_at, updated_at
```

#### `projects`
Generated content (blogs, posts, FAQs).
```sql
- id (uuid, PK)
- user_id (uuid, FK → auth.users)
- title (text)
- type (text) -- 'blog' | 'gbp_post' | 'faq' | 'review_reply'
- input (jsonb) -- {businessName, city, service, tone, ...}
- output_md (text) -- Generated markdown content
- created_at, updated_at
```

#### `subscriptions`
Stripe subscription mirror (managed via webhook).
```sql
- id (uuid, PK)
- user_id (uuid, FK → auth.users)
- stripe_subscription_id (text, unique)
- stripe_customer_id (text)
- status (text) -- 'active' | 'canceled' | 'past_due'
- plan (text)
- current_period_start, current_period_end
- created_at, updated_at
```

#### `user_billing`
Billing information and limits.
```sql
- user_id (uuid, PK, FK → auth.users)
- stripe_customer_id (text)
- billing_email (text)
- created_at, updated_at
```

### Google Business Profile Tables

#### `gbp_connections`
Connected Google accounts.
```sql
- id (uuid, PK)
- user_id (uuid, FK → auth.users)
- google_account_email (text)
- access_token (text, encrypted)
- refresh_token (text, encrypted)
- expires_at (timestamptz)
- created_at, updated_at
```

#### `gbp_locations`
Synced business locations.
```sql
- id (uuid, PK)
- connection_id (uuid, FK → gbp_connections)
- user_id (uuid, FK → auth.users)
- location_id (text) -- Google location ID
- name (text)
- title (text) -- Display name
- address (text)
- phone_number (text)
- website (text)
- rating (numeric)
- review_count (integer)
- created_at, updated_at
```

#### `reviews`
Reviews from Google and other platforms.
```sql
- id (uuid, PK)
- user_id (uuid, FK → auth.users)
- location_id (uuid, FK → gbp_locations, nullable)
- platform (text) -- 'google' | 'tripadvisor' | 'yelp' | 'manual'
- google_review_id (text, nullable)
- reviewer_name (text)
- rating (integer) -- 1-5
- comment (text)
- review_date (date)
- reply_status (text) -- 'pending' | 'queued' | 'replied' | 'posted'
- created_at, updated_at
```

#### `review_replies`
Generated and posted replies.
```sql
- id (uuid, PK)
- review_id (uuid, FK → reviews)
- user_id (uuid, FK → auth.users)
- reply_text (text)
- status (text) -- 'draft' | 'posted'
- posted_at (timestamptz, nullable)
- created_at, updated_at
```

### Future Tables (Phase 3+)

#### `automation_prefs`
Automation preferences per user/location.
```sql
- id (uuid, PK)
- user_id (uuid, FK → auth.users)
- location_id (uuid, FK → gbp_locations, nullable)
- auto_sync_reviews (boolean, default false)
- auto_post_positive (boolean, default false)
- notification_email (text, nullable)
- created_at, updated_at
```

#### `review_logs`
Log of automation actions.
```sql
- id (uuid, PK)
- user_id (uuid, FK → auth.users)
- review_id (uuid, FK → reviews)
- action (text) -- 'sync' | 'generate_reply' | 'post_reply'
- status (text) -- 'success' | 'error'
- error_message (text, nullable)
- created_at
```

#### `user_usage`
Monthly usage tracking (Phase 5).
```sql
- id (uuid, PK)
- user_id (uuid, FK → auth.users)
- month (date) -- First day of month
- content_generations (integer, default 0)
- review_replies (integer, default 0)
- audits_run (integer, default 0)
- created_at, updated_at
```

---

## Authentication Flow

### Email/Password
1. User signs up → Supabase Auth creates account
2. `profiles` row created via trigger or API
3. Session stored in cookies (httpOnly)
4. Middleware checks session on protected routes

### Google OAuth
1. User clicks "Sign in with Google" → `/api/auth/google`
2. Redirect to Google OAuth consent
3. Callback → `/api/auth/callback`
4. Supabase handles OAuth flow
5. Session established

### Session Management
- Server components: `requireUser()` from `lib/auth-server.ts`
- API routes: Extract user from request using `getUserFromRequest()`
- Client components: Use Supabase client to check session

---

## API Routes

### OpenAI Endpoints

#### `POST /api/openai/generate`
Generate content (blog/post/FAQ).
- Input: `{ type, businessName, city, topic, tone, ... }`
- Output: `{ content: string }`
- Usage tracking (Phase 5)

#### `POST /api/openai/review-reply`
Generate review reply.
- Input: `{ reviewText, rating, platform, businessName, ... }`
- Output: `{ reply: string }`
- Usage tracking (Phase 5)

### Google Business Profile Endpoints

#### `GET /api/google/oauth/start`
Initiate OAuth flow.
- Redirects to Google OAuth consent
- Stores state in session/cookie

#### `GET /api/google/oauth/callback`
Handle OAuth callback.
- Exchanges code for tokens
- Stores tokens in `gbp_connections` (encrypted)
- Redirects to settings page

#### `GET /api/google/locations`
List connected locations.
- Returns locations for authenticated user
- Filters by `user_id`

#### `POST /api/google/locations/sync`
Sync locations from Google.
- Fetches locations from Google API
- Upserts into `gbp_locations`
- Returns synced locations

#### `POST /api/google/reviews/sync`
Sync reviews for a location.
- Input: `{ locationId }`
- Fetches reviews from Google API
- Upserts into `reviews` table
- Returns new reviews count

#### `POST /api/google/replies`
Post reply to a review.
- Input: `{ reviewId, replyText }`
- Posts to Google Business Profile API
- Updates `review_replies` status
- Returns success/error

#### `POST /api/google/disconnect`
Disconnect Google account.
- Removes connection from `gbp_connections`
- Optionally removes related locations/reviews

### Stripe Endpoints

#### `POST /api/stripe/checkout`
Create checkout session.
- Input: `{ plan }`
- Creates Stripe checkout session
- Returns session URL

#### `POST /api/stripe/webhook`
Handle Stripe webhooks.
- Verifies webhook signature
- Updates `subscriptions` and `user_billing`
- Handles: `customer.subscription.created`, `updated`, `deleted`

#### `GET /api/stripe/portal`
Access customer portal.
- Creates Stripe portal session
- Returns portal URL

### Review Endpoints

#### `GET /api/reviews`
Get user's reviews.
- Returns reviews with filters (platform, status, date)
- Pagination support

#### `POST /api/reviews`
Create manual review entry.
- Input: `{ platform, reviewerName, rating, comment, reviewDate }`
- Creates review in database
- Returns created review

---

## Security

### Row Level Security (RLS)
All Supabase tables have RLS policies:
- Users can only access their own data
- Policies check `auth.uid() = user_id` (or equivalent)

### API Route Protection
- All API routes check authentication
- Use `getUserFromRequest()` helper
- Return 401 if unauthenticated

### Token Storage
- Google OAuth tokens stored encrypted in database
- Service role key only used server-side
- Never expose sensitive keys to client

### Environment Variables
- All secrets in `.env.local` (never committed)
- Client-side variables prefixed with `NEXT_PUBLIC_`
- Server-side variables only accessible in API routes/server components

---

## Content Generation Flow

### User Journey
1. User navigates to `/content`
2. Selects content type (blog/post/FAQ)
3. Fills in form (business name, city, topic, tone)
4. Submits → `POST /api/openai/generate`
5. API route:
   - Validates input
   - Calls OpenAI API with prompt
   - Saves to `projects` table
   - Returns generated content
6. UI displays markdown with copy/edit options

### Prompt Engineering
- Prompts emphasize local context (city, neighborhood, landmarks)
- Different prompts for different content types
- Include business name, service type, tone preference

---

## Review Management Flow

### Manual Entry
1. User navigates to `/reviews`
2. Pastes review text, selects platform/rating
3. Submits → `POST /api/reviews`
4. Optionally generates reply → `POST /api/openai/review-reply`
5. Saves reply draft to `review_replies`
6. User copies/posts manually

### Google Sync
1. User connects Google in `/settings`
2. Syncs locations → `POST /api/google/locations/sync`
3. Syncs reviews → `POST /api/google/reviews/sync`
4. Reviews appear in `/reviews` with "Generate Reply" option
5. User approves reply → `POST /api/google/replies` posts to Google

### Automation (Phase 3)
1. n8n workflow triggers every 3 hours
2. Calls `/api/google/reviews/sync` for auto-sync enabled locations
3. For new reviews:
   - Generates reply via `/api/openai/review-reply`
   - If rating ≥ 4 AND auto-post enabled: Posts via `/api/google/replies`
   - Else: Queues for manual approval
4. Logs actions to `review_logs`

---

## Error Handling

### API Routes
- Try-catch blocks around external API calls
- Return appropriate HTTP status codes
- Error messages in response body
- Log errors server-side (don't expose internals)

### Client-Side
- Handle API errors gracefully
- Show user-friendly error messages
- Retry logic for transient failures

### Database
- Foreign key constraints
- Transaction rollback on errors
- RLS prevents unauthorized access

---

## Deployment

### Environment Setup
- Next.js app on Vercel (or similar)
- Supabase project (hosted or self-hosted)
- Environment variables configured in deployment platform

### Database Migrations
- Run migrations via Supabase CLI or dashboard
- Test migrations in staging first
- Keep migrations reversible where possible

### Monitoring
- Error tracking (Sentry, LogRocket, etc.)
- Usage analytics (PostHog, Mixpanel, etc.)
- Stripe webhook monitoring
- API rate limit monitoring

---

## Future Considerations

### Scalability
- Database indexing on frequently queried columns
- API rate limiting (especially OpenAI)
- Caching for expensive operations
- CDN for static assets

### Multi-tenancy
- Agency mode will require account hierarchy
- Consider database sharding or multi-db per account
- Ensure data isolation

### API Versioning
- If external API consumers, version endpoints
- `/api/v1/...` structure

### Testing
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows
- Mock external APIs in tests

---

**Last Updated**: [Date]


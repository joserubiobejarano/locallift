# LocalLift Roadmap

This document outlines the development roadmap for LocalLift, organized into phases that build upon each other.

---

## 🎯 What is LocalLift?

LocalLift is an **AI-powered platform for local businesses and agencies**. It helps them:
- Generate local SEO content (blogs, GBP posts, FAQs)
- Reply to customer reviews with AI
- Audit and optimize Google Business Profiles
- Connect their GBP to sync locations and reviews
- Use an all-in-one dashboard for local growth

It includes a free audit funnel, a demo mode, and a subscription-based plan.

---

## 📍 Current Status – Where We Are

### ✅ Phase 1: Core Product (100% Complete)

**Goal**: Build the foundational product with all core features.

**Status**: ✅ **FULLY COMPLETE**

#### A) Authentication & User Management
- ✅ Email/password authentication
- ✅ Google OAuth login (for app access, NOT GBP connection)
- ✅ Secure session management with Auth.js (NextAuth v5) and Neon-backed users
- ✅ User profiles with business information

#### B) Dashboard & Navigation
- ✅ Main dashboard with overview
- ✅ Usage counters (posts, audits, review replies)
- ✅ Sidebar navigation
- ✅ Mobile-friendly responsive design

#### C) Local SEO Content Generator
- ✅ Blog post generation (hyper-local focus)
- ✅ Google Business Profile post generation
- ✅ FAQ generation
- ✅ Local SEO AI Agent (business + location aware)
- ✅ Neighborhood and landmark references
- ✅ Project history and management
- ✅ Copy-to-clipboard functionality

#### D) Review Reply Generator
- ✅ Manual review entry (any platform)
- ✅ AI-powered reply generation
- ✅ Review draft saving
- ✅ Review history tracking
- ✅ Platform-specific tone adjustments

#### E) Profile Audit Tool
- ✅ AI-powered profile audit
- ✅ Dedicated `/free-audit` landing page
- ✅ Lead capture via email
- ✅ Visual audit report with scoring
- ✅ Actionable recommendations
- ✅ Demo version available

#### F) Demo Mode
- ✅ Fake reviews for testing
- ✅ Fake locations for testing
- ✅ Sample audit data
- ✅ Ability to generate sample replies/content
- ✅ No Google connection required
- ✅ Perfect for demos and testing

#### G) Frontend & UX
- ✅ Homepage redesigned and implemented
- ✅ Legal pages (privacy, terms, contact)
- ✅ Feedback system (form + DB storage)
- ✅ Footer with all links
- ✅ Mobile-responsive design
- ✅ Modern UI with Tailwind + Radix

---

### ✅ Phase 2: Monetization & Billing (100% Complete)

**Goal**: Implement subscription system with Stripe integration and plan gating.

**Status**: ✅ **FULLY COMPLETE**

#### A) Stripe Integration
- ✅ Single plan: **LocalLift Starter – $14.99/month**
- ✅ 7-day free trial
- ✅ Stripe checkout flow
- ✅ Stripe customer portal
- ✅ Webhook handling (subscription events)
- ✅ Secure payment processing

#### B) Usage Limits System
- ✅ 20 posts/month limit
- ✅ 5 audits/month limit
- ✅ Unlimited review replies
- ✅ Monthly usage reset logic
- ✅ Usage tracking in database
- ✅ Usage display on dashboard

#### C) Plan Gating
- ✅ Block content generation above quota
- ✅ Block audits above quota
- ✅ Block Google features if not subscribed
- ✅ Upgrade prompts for free users
- ✅ Trial end date display
- ✅ Billing UI in Settings page

---

### ✅ Phase 3: Google Business Profile Infrastructure (70% Complete)

**Goal**: Build complete GBP integration for location sync, review sync, and reply posting.

**Status**: 🚧 **BACKEND COMPLETE – UI PARTIALLY DONE**

#### ✅ Backend (100% Complete)
- ✅ GBP OAuth flow
- ✅ Token refresh flow
- ✅ Google API helpers
- ✅ Sync GBP locations endpoint
- ✅ Sync GBP reviews endpoint
- ✅ Post replies to Google reviews endpoint
- ✅ Secure token storage (encrypted)
- ✅ RLS rules for connections, reviews, locations
- ✅ Database schema for GBP data

#### 🚧 UI (Partially Complete)
**Remaining UI Work:**

**Settings Page Needs:**
- [ ] Display connected GBP account email
- [ ] Show list of connected locations
- [ ] "Disconnect Google" button
- [ ] Auto-sync toggle option

**Reviews Page Needs:**
- [ ] Location selector dropdown (for multiple locations)
- [ ] "Sync reviews now" button
- [ ] Review status badges (new / replied / error)
- [ ] Loading and error states

**Note**: All backend functions exist. This is pure UI integration work.

---

## 🔮 What's NOT Built Yet (Future Phases)

### Phase 4: Pre-Launch Polish (Not Started)

**Goal**: Final testing, error logging, and performance optimization before launch.

**Prerequisites**: Access to a real Google Business Profile for end-to-end testing.

#### Testing
- [ ] End-to-end GBP testing with real location
- [ ] Test OAuth connection flow
- [ ] Test location sync
- [ ] Test review sync
- [ ] Test reply posting
- [ ] Test all rate limits
- [ ] Test onboarding flow
- [ ] Test sign-in / sign-up
- [ ] Test free audit funnel
- [ ] Test Stripe integration
- [ ] Test demo mode

#### Error Logging & Monitoring
- [ ] Implement error tracking (Sentry recommended)
- [ ] User-friendly error messages
- [ ] Error reporting system
- [ ] API error handling improvements

#### Performance
- [ ] Load testing
- [ ] Database query optimization
- [ ] API response time monitoring
- [ ] Frontend performance audit

#### UI Polish
- [ ] Final design review
- [ ] Mobile responsiveness check
- [ ] Accessibility improvements
- [ ] Loading states everywhere

---

### Phase 5: Advanced Features (Future)

**Goal**: Add premium features for power users and agencies.

**Status**: 🔮 **NOT STARTED**

#### Features to Build
- [ ] Scheduled posts (via n8n)
- [ ] Rank tracking / local keyword monitoring
- [ ] Competitor insights
- [ ] GBP change protection (alert if photos/categories change)
- [ ] Multi-location support (for agencies)
- [ ] Multi-platform review integrations:
  - Yelp
  - TripAdvisor
  - Facebook
  - Apple Maps

**Expected Outcome**: Advanced features for power users and agencies.

---

### Phase 6: Automation & n8n (Future)

**Goal**: Automated workflows that run in the background.

**Status**: 🔮 **NOT STARTED**

**Prerequisites**: 
- At least one real GBP connection working
- n8n instance set up (self-hosted or cloud)

#### Google Review Automation
**n8n Workflow:**
1. Cron trigger (every 3 hours)
2. HTTP request → Call `/api/google/reviews/sync` for each location where auto-sync is enabled
3. For each new review:
   - Call `/api/openai/review-reply` to generate reply
   - If rating ≥ 4 AND auto-post enabled:
     - Call `/api/google/replies` to post automatically
   - Else (rating 1-3):
     - Save as queued, send email notification
4. Log all actions to `review_logs` table

#### Content Automation
**Monthly Content Suggestions:**
- Cron: First of each month
- For each active user:
  - Generate 3 blog post ideas (based on seasonality, location, reviews)
  - Generate 3 GBP post ideas
  - Generate FAQ suggestions (based on review trends)
  - Email summary: "Your content ideas for [Month]"

#### Multi-Platform Routing
**Long-term vision**: Support multiple review platforms
- Start with manual entry for non-Google platforms
- Research APIs for: Apple Maps, Bing, TripAdvisor, Yelp, TheFork
- Use n8n to poll and normalize into `reviews` table
- Platform-specific reply tone adjustments

**Note**: Many platforms lack open APIs. May require:
- Third-party aggregator services
- Scraping (legal considerations)
- Paid API access

**Expected Outcome**: Hands-off review management and content suggestions.

---

### Phase 7: Analytics & Reporting (Future)

**Goal**: Provide insights and support agency workflows.

**Status**: 🔮 **NOT STARTED**

#### Simple Analytics Dashboard
**Overview Dashboard:**
- Reviews replied this week
- Content pieces generated this month
- Average star rating (from synced reviews)
- Reply rate percentage
- Charts: Review volume over time, rating distribution
- Trend cards with month-over-month comparisons

#### Monthly Reports
**Automated Report Generation:**
- PDF or HTML export
- Includes:
  - Review summary (count, average rating, reply rate)
  - Content generated (count, types)
  - Profile audit results
  - Recommendations for next month
- "Download Monthly Report" button on Overview
- Shareable reports for business owners and agency clients

#### Agency Mode (v2 Feature)
**Multi-Profile Support:**
- One account managing multiple businesses
- `accounts` table (agency/team)
- `account_members` table (roles: Owner, Manager, Staff)
- `profiles` linked to `accounts`
- Role-based permissions

**Client Management:**
- Add/manage client businesses
- View aggregated stats across all clients
- White-label options (future)

**Expected Outcome**: Agencies can manage multiple clients from one dashboard.

---

## 🎯 Immediate Next Steps (Developer Guide)

Here's the exact sequence to follow next:

### ▶ STEP 1 — Finish GBP UI Wiring (CURRENT PRIORITY)

**All backend is done. This is pure UI work.**

#### Settings Page
- [ ] Show connected GBP email
- [ ] Show list of locations
- [ ] Add "Disconnect Google" button
- [ ] Add auto-sync toggle

#### Reviews Page
- [ ] Add location selector dropdown
- [ ] Add "Sync reviews now" button
- [ ] Add review status badges
- [ ] Add loading & error states

**Estimated Time**: 1-2 days

---

### ▶ STEP 2 — Improve Demo Mode

**Add better demo experience:**
- [ ] Top banner "You're in demo mode"
- [ ] Limit demo items (3 replies, 2 posts)
- [ ] Disable "Post to Google" in demo
- [ ] Add modal prompting signup after limits

**Estimated Time**: 1 day

---

### ▶ STEP 3 — Finalize Audit Funnel

**Polish the free audit landing page:**
- [ ] Improve audit results layout
- [ ] Add CTA banner at bottom: "Want full access? Try LocalLift free for 7 days"
- [ ] Add social proof elements
- [ ] Optimize conversion flow

**Estimated Time**: 1 day

---

### ▶ STEP 4 — Add Analytics Section

**In `/dashboard` show:**
- [ ] Content generated this month
- [ ] Reviews replied
- [ ] Audits run
- [ ] Remaining quota
- [ ] Trend cards (vs. last month)
- [ ] Simple charts

**Estimated Time**: 2 days

---

### ▶ STEP 5 — Implement Plan Gating Everywhere

**Double-check UI blocks users properly:**
- [ ] Reviews posting → only for subscribed users
- [ ] Content generation limit enforcement
- [ ] Audit limit enforcement
- [ ] Show upgrade CTA in all gated areas
- [ ] Test trial expiration flow

**Estimated Time**: 1 day

---

### ▶ STEP 6 — Pre-Launch QA

**Once you have access to a real GBP:**
- [ ] Test connection
- [ ] Test location sync
- [ ] Test review sync
- [ ] Test posting replies
- [ ] Test rate limits
- [ ] Test onboarding flow
- [ ] Test sign-in / sign-up
- [ ] Test free audit
- [ ] Test Stripe
- [ ] Test demo mode

**Estimated Time**: 2-3 days

---

### ▶ STEP 7 — Deploy Marketing Assets

**Improve marketing presence:**
- [ ] Improve homepage hero copy
- [ ] Create a "Why LocalLift?" page
- [ ] Add case studies (dummy for now)
- [ ] Add testimonials section
- [ ] SEO optimization

**Estimated Time**: 2-3 days

---

## 📊 Key Features Available RIGHT NOW

### Production-Ready Features

✅ **Authentication System**
- Email/password signup/login
- Google OAuth for app access
- Secure session management

✅ **Content Generator**
- Blog posts (hyper-local)
- GBP posts
- FAQs
- Local SEO agent
- Usage limits (20/month)
- Project history

✅ **Review Management**
- Manual review entry
- AI reply generation
- Save reply drafts
- Track review statuses
- View history
- Unlimited replies

✅ **Audit Tool**
- `/free-audit` landing page
- AI audit report with scoring
- Lead capture via email
- Demo version in `/demo`
- Great for marketing

✅ **Demo Environment**
- Fake location
- Fake reviews
- Sample audit
- Sample content
- Sandbox mode for testing

✅ **Billing System (Stripe)**
- Single plan: $14.99/month
- 7-day trial
- Webhooks
- Subscription gating
- Billing portal
- Limits enforced

✅ **Frontend Polish**
- New homepage
- Footer + legal pages
- Feedback page
- Better UX everywhere
- Mobile-friendly

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS** + **Radix UI**
- **Lucide React** (icons)

### Backend
- **Next.js API Routes**
- **Auth.js** (NextAuth v5) for authentication
- **Neon Postgres** for data

### Integrations
- **Google Business Profile API**
- **Stripe** (payments)
- **OpenAI** (GPT-4o-mini + custom local SEO agent)

### Future
- **n8n** (workflow automation)

---

## 📈 Success Metrics

### Phase 1-3 Success (Current)
- ✅ Users can sign up and generate valuable content
- ✅ Users can paste reviews and get AI replies
- ✅ Profile audit provides actionable insights
- ✅ Subscription system works end-to-end
- ✅ Demo mode showcases product value

### Phase 4 Success (Pre-Launch)
- [ ] At least 5 users connect their Google Business Profile
- [ ] Reviews sync successfully from GBP
- [ ] Users post replies through the platform
- [ ] No critical bugs in production

### Phase 5-6 Success (Advanced Features)
- [ ] Automation runs without manual intervention
- [ ] Positive reviews get auto-replied within hours
- [ ] Users receive valuable monthly content suggestions

### Phase 7 Success (Analytics)
- [ ] Users check analytics dashboard regularly
- [ ] Reports are downloaded and shared
- [ ] At least one agency uses multi-profile features

---

## 💡 Constraints & Reality Checks

### Current Limitations

1. **No Real GBP for Testing**
   - Cannot fully test Google API end-to-end without a real location
   - Solution: Mock data for development, test with real GBP when available

2. **Third-Party Platforms**
   - Many lack open APIs (TripAdvisor, Apple Maps, etc.)
   - Proper integration may require scraping, proxies, or paid APIs
   - Phase 1 approach: Manual paste still provides huge value

3. **Business Profile API Access**
   - Only returns detailed data for locations where the account is owner/manager
   - Works for real users & agency clients
   - Doesn't work for random prospects (hence manual URL paste option)

### Strategy

- **Build valuable features that work without GBP** ✅ Done
- **Make GBP integration optional enhancement** ✅ Done
- **When you have real GBP access, flip the switch** 🚧 In Progress
- **Expand to automation** 🔮 Future

---

## 📝 Notes for Development

- **Feature Flags**: Use feature flags for gradual rollout of new features
- **Error Handling**: Always provide fallback to manual mode if APIs fail
- **User Feedback**: Watch what users actually do vs. what we expect
- **Iterate Quickly**: Ship features, gather feedback, then iterate
- **Test Thoroughly**: Test with real GBP before full launch

---

## ❓ Questions to Answer as We Build

1. **Phase 4**: What content types do users request most? What review platforms?
2. **Phase 5**: How many locations do typical users manage? Any sync issues?
3. **Phase 6**: What automation frequency do users prefer? How many want auto-post?
4. **Phase 7**: What metrics matter most to users? What do they share with clients?

---

**Last Updated**: April 2026  
**Current Focus**: Phase 3 – GBP polish, demo limits, pre-launch QA  
**Next Priority**: Demo mode polish, plan-gating verification, production observability

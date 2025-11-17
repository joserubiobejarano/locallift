# LocalLift Roadmap

This document outlines the development roadmap for LocalLift, organized into phases that build upon each other.

---

## Phase 1: "Manual but Powerful" MVP ✅ In Progress

**Goal**: Create a valuable product that works without any GBP connection, allowing immediate user value.

### Status: ~60% Complete

### 1.1. Clean UX Around Existing Features ✅

**Completed:**
- ✅ Sign up/login (email + Google OAuth)
- ✅ Dashboard shell (Overview/Content/Reviews/Settings)
- ✅ Content generator (blog / GBP post / FAQ)
- ✅ Manual review reply generator

**In Progress:**
- 🚧 Polish content generator prompts to emphasize local angle (city, neighborhood, landmarks)
- 🚧 Add "Topic / angle" field for more specific content requests
  - Example: "What's the piece about?" → "Summer dinners on a terrace in Brooklyn"

**Remaining:**
- ⏳ Polish manual review replies interface
  - Add platform selector (Google, TripAdvisor, Yelp, "Other")
  - Improve review text paste interface
  - Add "Copy reply" button for easy manual posting
  - Save replies as `review_reply` drafts in database

**Expected Outcome**: Users can generate local SEO content and reply to reviews without any integrations.

---

### 1.2. Profile Audit Feature ⏳ Not Started

**Goal**: Help users optimize their Google Business Profile with AI-powered suggestions.

#### For Users WITH GBP Connection (Owners/Managers)

**When Google is connected and locations exist:**
- Display "Audit a connected location" section
- Show dropdown with connected locations
- One-click audit button → calls Business Profile API
- Backend fetches:
  - Business name, description, categories
  - Hours, rating, review stats
  - Photos count, posts activity
  - Other management-accessible data
- AI analyzes and generates:
  - Overall profile health score
  - Suggestions for name optimization
  - Description improvements
  - Category recommendations
  - Photo strategy suggestions
  - Posting frequency recommendations

**Status**: API infrastructure exists, UI needed

#### For Users WITHOUT GBP Connection (Prospects)

**Option A: Paste GBP URL** (Recommended for Phase 1)
- Simple input: "Paste your Google Business Profile URL or type business name + city"
- Optional category selector
- Backend (Phase 1): Use URL/name as context for LLM-generated audit
- Backend (Future): Extract Place ID and call Google Places API for real data

**Option B: Minimal Form**
- Business name + city required
- Category optional
- LLM generates smart, local audit without API calls

**Implementation Plan:**
1. Create `/profile-audit` page in dashboard
2. Detect if Google is connected
3. Show appropriate UI (connected vs. manual entry)
4. Build audit API endpoint that:
   - For connected: Calls Business Profile API
   - For manual: Uses LLM with provided context
5. Display audit results with score and actionable suggestions

**Expected Outcome**: Users can audit any business profile, generating value for prospects and current customers.

---

### 1.3. Marketing Homepage & Onboarding ⏳ Not Started

**Goal**: Professional landing page and smooth onboarding flow.

**Landing Page (`/`):**
- H1: "Your AI assistant for local business profiles"
- 3 feature blocks: Content, Reviews, Profile Audit
- CTA: "Start free" → `/signup`
- Simple, clean design
- Brief value proposition

**Onboarding Flow (Post-signup):**
- Step 1: Business name, city, category
- Step 2: Main platform preference (Google, TripAdvisor, etc.)
- Store in `profiles` table (fields already exist)
- Redirect to dashboard

**Expected Outcome**: Professional first impression and smooth user onboarding.

---

## Phase 2: Google Business Profile Wiring 🚧 Partial

**Goal**: Make Google integration fully functional (behind feature flag if needed).

**Prerequisites**: Access to at least one real GBP location (your own or test client).

### 2.1. Finish Google Flows 🚧 70% Complete

**Completed:**
- ✅ OAuth connection flow
- ✅ Location syncing infrastructure
- ✅ Review syncing infrastructure
- ✅ Reply posting infrastructure

**In Progress:**
- 🚧 Settings page improvements:
  - Display connected email
  - Show list of synced locations
  - Add toggle: "Enable auto-sync of reviews" (store in `automation_prefs`)
  - Disconnect option

**Remaining:**
- ⏳ Reviews page enhancements:
  - Location dropdown (if user has multiple locations)
  - "Sync reviews" button that calls `/api/google/reviews/sync`
  - Info box if no locations: "No Google location found. You can still paste reviews manually."
  - Display synced reviews with status (new, replied, queued)

**Testing Strategy:**
- Mock data in Supabase (fake `gbp_locations` and `reviews`) for UI testing
- Test with real GBP when available
- Feature flag for gradual rollout

**Expected Outcome**: Fully functional Google Business Profile integration for users who connect their account.

---

## Phase 3: Automation & n8n 🔮 Future

**Goal**: Automated workflows that run in the background.

**Prerequisites**: 
- At least one real GBP connection working
- n8n instance set up (self-hosted or cloud)

### 3.1. Google Review Automation

**n8n Workflow:**
1. Cron trigger (every 3 hours)
2. HTTP request → Call `/api/google/reviews/sync` for each location where `automation_prefs.auto_sync_reviews = true`
3. For each new review:
   - Call `/api/openai/review-reply` to generate reply
   - If rating ≥ 4 AND `automation_prefs.auto_post_positive = true`:
     - Call `/api/google/replies` to post automatically
   - Else (rating 1-3):
     - Save as queued, send email notification
4. Log all actions to `review_logs` table

**Database:**
- Create `automation_prefs` table (or add to existing)
  - `user_id`
  - `location_id` (nullable for global settings)
  - `auto_sync_reviews` (boolean)
  - `auto_post_positive` (boolean)
  - `notification_email` (nullable)
- Create `review_logs` table
  - `id`, `user_id`, `review_id`, `action`, `status`, `created_at`

**Expected Outcome**: Hands-off review management for positive reviews, with manual approval for critical ones.

### 3.2. Content Automation

**Monthly Content Suggestions:**
- Cron: First of each month
- For each active user:
  - Generate 3 blog post ideas (based on seasonality, location, reviews)
  - Generate 3 GBP post ideas
  - Generate FAQ suggestions (based on review trends)
  - Email summary: "Your content ideas for [Month]"

**Expected Outcome**: Users receive monthly inspiration without logging in.

### 3.3. Multi-Platform Routing (Future)

**Long-term vision**: Support multiple review platforms
- Start with manual entry for non-Google platforms
- Research APIs for: Apple Maps, Bing, TripAdvisor, Yelp, TheFork
- Use n8n to poll and normalize into `reviews` table
- Platform-specific reply tone adjustments

**Note**: Many platforms lack open APIs. May require:
- Third-party aggregator services
- Scraping (legal considerations)
- Paid API access

---

## Phase 4: Analytics, Reporting & Agency Mode 🔮 Future

**Goal**: Provide insights and support agency workflows.

### 4.1. Simple Analytics

**Overview Dashboard:**
- Reviews replied this week
- Content pieces generated this month
- Average star rating (from synced reviews)
- Reply rate percentage
- Charts: Review volume over time, rating distribution

**Expected Outcome**: Users see their activity and progress at a glance.

### 4.2. Reporting & Exports

**Monthly Report:**
- PDF or HTML export
- Includes:
  - Review summary (count, average rating, reply rate)
  - Content generated (count, types)
  - Profile audit results
  - Recommendations for next month
- "Download Monthly Report" button on Overview

**Expected Outcome**: Shareable reports for business owners and agency clients.

### 4.3. Agency Mode (v2 Feature)

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

## Phase 5: Stripe & Pricing 💰 Future

**Goal**: Implement usage limits and paid tiers.

**Prerequisites**: Core features stable and valuable.

### 5.1. Pricing Tiers (Proposed)

**Free:**
- 10 content generations/month
- 10 review replies/month
- 1 business profile
- Manual review entry only

**Starter ($29/month):**
- 100 content generations
- 100 review replies
- 1-2 business profiles
- Google Business Profile sync
- Profile audit (3/month)

**Pro ($79/month):**
- 500 content generations
- 500 review replies
- Up to 5 business profiles
- Google Business Profile sync
- Profile audit (unlimited)
- **Automation features** (auto-sync, auto-reply to positive reviews)
- Email notifications

**Agency (Custom):**
- Everything in Pro
- Unlimited profiles
- Multi-user support
- White-label options
- Priority support

### 5.2. Implementation

**Database:**
- Create `user_usage` table:
  - `user_id`, `month`, `content_generations`, `review_replies`, `audits_run`
- Track usage on each API call

**API Changes:**
- Check limits before processing requests
- Return appropriate error messages when limits exceeded
- Show upgrade prompts in UI

**Stripe Integration:**
- ✅ Checkout flow (exists, needs polish)
- ✅ Webhook handling (exists, needs testing)
- ⏳ Subscription management UI
- ⏳ Usage dashboard
- ⏳ Upgrade/downgrade flows

**UI:**
- Usage meters on dashboard
- "You've hit your limit – upgrade to X" banners
- Upgrade CTAs in relevant places
- Billing portal access

**Expected Outcome**: Sustainable business model with clear upgrade paths.

---

## Use Cases by Theme

### A. Review & Reputation Management

**✅ Current:**
- AI replies to Google reviews (manual paste)
- Manual review entry

**🚧 Phase 2:**
- Synced reviews from GBP
- Queue workflow (approve before posting)

**🔮 Phase 3:**
- Auto-reply to 4-5★ reviews
- Review insights ("Top complaints", "Most mentioned strengths")
- FAQ/post ideas based on reviews
- Reputation alerts (email notifications for negative reviews)

**🔮 Future:**
- Multi-platform reviews (TripAdvisor, Yelp, etc.)
- Advanced analytics (sentiment trends, competitor comparison)

---

### B. Local SEO Content

**✅ Current:**
- Hyper-local blog posts
- GBP post drafts
- FAQ generation

**🚧 Phase 1.1:**
- Enhanced prompts for neighborhood focus
- Topic/angle field for specificity

**🔮 Phase 3:**
- Content calendar (4 suggested posts/month with dates)
- Seasonal content suggestions
- Review-based content ideas

**🔮 Future:**
- Content scheduling (direct GBP posting)
- A/B testing for post performance
- Content performance tracking

---

### C. Profile / Listing Optimization

**⏳ Phase 1.2:**
- Profile audit for connected locations
- Profile audit for prospects (URL paste)

**🔮 Future:**
- Profile health score tracking over time
- Image analysis and suggestions
- Category optimization recommendations
- Competitor profile comparison

---

### D. Automation & Orchestration

**🔮 Phase 3:**
- Google review automation (n8n)
- Content automation (monthly suggestions)
- Email notifications

**🔮 Future:**
- Multi-platform routing
- Custom workflow builder
- Integration with other tools (Zapier, Make)

---

### E. Reporting & Agency Use

**🔮 Phase 4:**
- Simple analytics dashboard
- Monthly report exports
- Agency mode (multi-profile)

**🔮 Future:**
- Client portals
- White-label options
- Advanced analytics and insights
- API access for agencies

---

## Constraints & Reality Checks

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

- **Build valuable features that work without GBP** (Phase 1)
- **Make GBP integration optional enhancement** (Phase 2)
- **When you have real GBP access, flip the switch** (Phase 2)
- **Expand to automation** (Phase 3) only after core is stable

---

## Success Metrics

### Phase 1 Success
- [ ] Users can sign up and generate valuable content without any integrations
- [ ] Users can paste reviews and get AI replies instantly
- [ ] Profile audit provides actionable insights
- [ ] Users complete onboarding and return to dashboard

### Phase 2 Success
- [ ] At least 5 users connect their Google Business Profile
- [ ] Reviews sync successfully from GBP
- [ ] Users post replies through the platform

### Phase 3 Success
- [ ] Automation runs without manual intervention
- [ ] Positive reviews get auto-replied within hours
- [ ] Users receive valuable monthly content suggestions

### Phase 4 Success
- [ ] Users check analytics dashboard regularly
- [ ] Reports are downloaded and shared
- [ ] At least one agency uses multi-profile features

### Phase 5 Success
- [ ] Free tier users convert to paid (target: 5-10% conversion)
- [ ] Paid users stay subscribed (target: <10% churn/month)
- [ ] Usage tracking accurately prevents abuse

---

## Notes for Development

- **Feature Flags**: Use feature flags for gradual rollout of new features
- **Error Handling**: Always provide fallback to manual mode if APIs fail
- **User Feedback**: Watch what users actually do vs. what we expect
- **Iterate Quickly**: Ship Phase 1 features, gather feedback, then move to Phase 2
- **Stripe Last**: Don't block on payments until core value is proven

---

## Questions to Answer as We Build

1. **Phase 1**: What content types do users request most? What review platforms?
2. **Phase 2**: How many locations do typical users manage? Any sync issues?
3. **Phase 3**: What automation frequency do users prefer? How many want auto-post?
4. **Phase 4**: What metrics matter most to users? What do they share with clients?
5. **Phase 5**: What's the optimal free tier limit? What features justify Pro pricing?

---

**Last Updated**: [Date]
**Current Focus**: Phase 1.2 - Profile Audit Feature


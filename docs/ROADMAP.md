# LocalLift Roadmap

This document outlines the development roadmap for LocalLift, organized into phases that build upon each other.

---

## Phase 1: Monetization (NOW) ✅ Complete

**Goal**: Implement single $14.99/mo plan with Stripe integration, plan gating, and foundation for growth.

### Status: ✅ Complete

### 1.1. Stripe Subscription Plan ✅

**Completed:**
- ✅ Single "LocalLift Starter" plan at $14.99/month
- ✅ 7-day free trial implementation
- ✅ Stripe checkout integration with price ID from environment
- ✅ Webhook handling for checkout.session.completed and customer.subscription.updated
- ✅ Database fields: plan_type, plan_status, plan_current_period_end
- ✅ Helper functions: isPaidUser(), isTrialing(), isFreeUser()
- ✅ Plan status recognition: active | trialing | past_due | canceled

**Expected Outcome**: Users can subscribe to LocalLift Starter with automatic subscription management.

---

### 1.2. Plan Gating Across App ✅

**Completed:**
- ✅ Full plan gating on /reviews page (Google connection, sync, reply posting)
- ✅ Full plan gating on /audit page (connected mode audits)
- ✅ Full plan gating on /content page (content generation)
- ✅ Plan gating on Google OAuth routes and API endpoints
- ✅ Upgrade banners and modals for free users
- ✅ Trial end date display for trialing users
- ✅ Demo mode still works with sample data

**Expected Outcome**: Free users see upgrade prompts, paid/trialing users have full access.

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

### 1.3. Free Audit Landing Page ✅

**Completed:**
- ✅ Standalone /free-audit page (no login required)
- ✅ Form fields: business name/URL, city, category, email
- ✅ Uses existing quick audit function (openai.generateProfileAudit)
- ✅ Stores leads in Supabase "leads" table
- ✅ Beautiful visual report with score (colored), indicators, priorities
- ✅ CTA: "Want ongoing optimization? Try LocalLift Starter ($14.99/mo)"

**Expected Outcome**: Prospects can try the product without signing up, generating leads.

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

## Phase 2: Product Value ✅ Complete

**Goal**: Enhance product value with local SEO agent, usage limits, and analytics.

### Status: ✅ Complete

### 2.1. Local SEO AI Agent ✅

**Completed:**
- ✅ Created src/lib/agents/localSeoAgent.ts
- ✅ System prompt includes business name, city, category, tone
- ✅ Knowledge of city neighborhoods, landmarks, local culture
- ✅ generateLocalContent() function for business-specific content
- ✅ Updated /content page to use local SEO agent instead of generic ChatGPT

**Expected Outcome**: Content is less generic and more business-specific with local references.

### 2.2. Monthly Usage Limits ✅

**Completed:**
- ✅ Usage tracking: ai_posts_used, audits_used, usage_reset_date
- ✅ Limits for LocalLift Starter: 20 posts/month, 5 audits/month
- ✅ Unlimited review replies
- ✅ Usage reset logic on monthly cycle
- ✅ Usage display on /dashboard
- ✅ Limit checking before generation with error messages

**Expected Outcome**: Users see their usage and are prevented from exceeding limits.

---

## Phase 3: Foundation ✅ Complete

**Goal**: Legal pages, contact, and feedback infrastructure.

### Status: ✅ Complete

### 3.1. Legal Pages ✅

**Completed:**
- ✅ /contact page
- ✅ /privacy page
- ✅ /terms page
- ✅ /legal page
- ✅ /feedback page with form submission
- ✅ Feedback table in Supabase
- ✅ Footer component with links to all pages

**Expected Outcome**: Professional legal foundation and user feedback collection.

---

## Phase 4: Google Business Profile Wiring 🚧 Partial

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

## Phase 7: Automation & n8n 🔮 Future

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

### 6.1. Scheduled Posts (n8n)
- Automated content scheduling
- Integration with n8n workflows

### 6.2. Rank Tracking
- Track local search rankings
- Competitor analysis

### 6.3. Competitor Insights
- Compare with competitors
- Identify opportunities

### 6.4. Multi-Location
- Support for multiple business locations
- Centralized management

### 6.5. GBP Change Protection
- Monitor for unauthorized changes
- Alert system

**Expected Outcome**: Advanced features for power users and agencies.

---

## Phase 7: Automation & n8n 🔮 Future

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

## Phase 5: Pre-Launch 🔮 Future

**Goal**: Full GBP testing, error logging, performance checks.

**Prerequisites**: Core features stable and valuable.

### 5.1. Full GBP Testing
- End-to-end testing with real Google Business Profile
- Test all sync flows
- Verify webhook reliability

### 5.2. Error Logging
- Comprehensive error tracking
- User-friendly error messages
- Error reporting system

### 5.3. Performance Checks
- Load testing
- Database optimization
- API response time monitoring

**Expected Outcome**: Production-ready system with monitoring and reliability.

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

**Last Updated**: November 18, 2025
**Current Focus**: Phase 4 - Google Business Profile Wiring (70% Complete)


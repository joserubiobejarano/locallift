# LocalLift - Next Steps (Developer Guide)

This document provides a clear, actionable guide for what to build next.

---

## 🎯 Current Status

**Phase 3: Google Business Profile Infrastructure** - 70% Complete

- ✅ **Backend**: 100% Complete (OAuth, sync, reply posting all working)
- 🚧 **UI**: Partially Complete (needs Settings + Reviews page enhancements)

---

## 📋 Immediate Priorities (In Order)

### ▶ STEP 1: Finish GBP UI Wiring ⭐ **CURRENT PRIORITY**

**Status**: Backend complete, UI integration needed  
**Estimated Time**: 1-2 days  
**Complexity**: Low (pure UI work, all APIs exist)

#### Settings Page Enhancements
- [ ] Display connected GBP account email
- [ ] Show list of connected locations (name, address, rating)
- [ ] Add "Disconnect Google" button with confirmation modal
- [ ] Add auto-sync toggle option (store preference in database)

**Files to Edit**:
- `src/app/(dashboard)/settings/page.tsx`
- Potentially create: `src/components/GoogleConnectionCard.tsx`

**API Endpoints to Use**:
- `GET /api/google/locations` (already exists)
- `POST /api/google/disconnect` (already exists)

---

#### Reviews Page Enhancements
- [ ] Add location selector dropdown (for users with multiple locations)
- [ ] Add "Sync reviews now" button (calls sync endpoint)
- [ ] Add review status badges (new / replied / error)
- [ ] Add loading states during sync
- [ ] Add error states with user-friendly messages
- [ ] Show info box if no locations: "No Google location found. You can still paste reviews manually."

**Files to Edit**:
- `src/app/(dashboard)/reviews/page.tsx`
- Potentially create: `src/components/ReviewSyncButton.tsx`
- Potentially create: `src/components/ReviewStatusBadge.tsx`

**API Endpoints to Use**:
- `GET /api/google/locations` (already exists)
- `POST /api/google/reviews/sync` (already exists)

---

### ▶ STEP 2: Improve Demo Mode

**Status**: Demo exists but needs polish  
**Estimated Time**: 1 day  
**Complexity**: Low

#### Enhancements Needed
- [ ] Add top banner: "You're in demo mode" (dismissible)
- [ ] Limit demo items (max 3 replies, 2 posts)
- [ ] Disable "Post to Google" button in demo
- [ ] Add modal after limits: "Want to try the real thing? Sign up for free"
- [ ] Add visual indicators that data is fake

**Files to Edit**:
- `src/app/(dashboard)/demo/page.tsx` (if exists)
- Or add demo detection to existing pages

**Database**:
- Check if user is in demo mode (e.g., `is_demo` flag or special demo user ID)

---

### ▶ STEP 3: Finalize Audit Funnel

**Status**: Free audit page exists, needs conversion optimization  
**Estimated Time**: 1 day  
**Complexity**: Low

#### Polish Needed
- [ ] Improve audit results layout (better visual hierarchy)
- [ ] Add CTA banner at bottom: "Want full access? Try LocalLift free for 7 days"
- [ ] Add social proof elements (testimonials, trust badges)
- [ ] Optimize conversion flow (reduce friction)
- [ ] Add email follow-up sequence (future)

**Files to Edit**:
- `src/app/free-audit/page.tsx`
- Potentially create: `src/components/AuditResultsCard.tsx`

---

### ▶ STEP 4: Add Analytics Section to Dashboard

**Status**: Not started  
**Estimated Time**: 2 days  
**Complexity**: Medium

#### Dashboard Metrics to Add
- [ ] Content generated this month (with progress bar)
- [ ] Reviews replied this month
- [ ] Audits run this month
- [ ] Remaining quota (visual indicators)
- [ ] Trend cards (vs. last month, e.g., "+15% from last month")
- [ ] Simple charts (bar chart for usage over time)

**Files to Edit**:
- `src/app/(dashboard)/dashboard/page.tsx`
- Create: `src/components/UsageChart.tsx`
- Create: `src/components/TrendCard.tsx`

**Database Queries**:
- Aggregate usage from `profiles` table
- Calculate month-over-month trends

**Libraries to Use**:
- Consider: `recharts` or `chart.js` for simple charts

---

### ▶ STEP 5: Implement Plan Gating Everywhere

**Status**: Partially implemented, needs verification  
**Estimated Time**: 1 day  
**Complexity**: Low

#### Verification Checklist
- [ ] Reviews posting → only for subscribed users
- [ ] Content generation → enforce 20/month limit
- [ ] Audit → enforce 5/month limit
- [ ] Show upgrade CTA in all gated areas
- [ ] Test trial expiration flow
- [ ] Test free user experience (should see upgrade prompts)
- [ ] Test paid user experience (should have full access)

**Files to Check**:
- `src/app/(dashboard)/content/page.tsx`
- `src/app/(dashboard)/reviews/page.tsx`
- `src/app/(dashboard)/audit/page.tsx`
- All API routes that should be gated

**Helper Functions**:
- Use existing: `isPaidUser()`, `isTrialing()`, `isFreeUser()`

---

### ▶ STEP 6: Pre-Launch QA

**Status**: Waiting for real GBP access  
**Estimated Time**: 2-3 days  
**Complexity**: High (requires real GBP)

#### Testing Checklist

**Google Business Profile Integration**:
- [ ] Test OAuth connection flow
- [ ] Test location sync (single location)
- [ ] Test location sync (multiple locations)
- [ ] Test review sync
- [ ] Test posting replies to reviews
- [ ] Test token refresh flow
- [ ] Test disconnect flow

**Core Features**:
- [ ] Test onboarding flow (new user signup)
- [ ] Test sign-in / sign-up
- [ ] Test content generation (all types)
- [ ] Test review reply generation
- [ ] Test free audit funnel
- [ ] Test demo mode

**Billing & Limits**:
- [ ] Test Stripe checkout
- [ ] Test trial expiration
- [ ] Test usage limits (hit 20 posts, 5 audits)
- [ ] Test usage reset (monthly cycle)
- [ ] Test customer portal

**Edge Cases**:
- [ ] Test with no GBP connection
- [ ] Test with expired GBP tokens
- [ ] Test with rate limits hit
- [ ] Test with invalid inputs

---

### ▶ STEP 7: Deploy Marketing Assets

**Status**: Homepage exists, needs polish  
**Estimated Time**: 2-3 days  
**Complexity**: Medium

#### Marketing Improvements
- [ ] Improve homepage hero copy (clearer value proposition)
- [ ] Create a "Why LocalLift?" page (benefits, use cases)
- [ ] Add case studies section (dummy for now, real later)
- [ ] Add testimonials section (fake for now, real later)
- [ ] Add FAQ section on homepage
- [ ] SEO optimization (meta tags, structured data)
- [ ] Add blog section (optional, for content marketing)

**Files to Edit**:
- `src/app/page.tsx` (homepage)
- Create: `src/app/why-locallift/page.tsx`
- Create: `src/components/TestimonialsSection.tsx`
- Create: `src/components/CaseStudiesSection.tsx`

---

## 🔮 Future Phases (Not Immediate)

### Phase 4: Pre-Launch Polish
- Error logging (Sentry)
- Performance optimization
- Final UI polish
- Mobile responsiveness check

### Phase 5: Advanced Features
- Scheduled posts (n8n)
- Rank tracking
- Competitor insights
- Multi-location support
- Multi-platform review integrations

### Phase 6: Automation & n8n
- Auto-reply to positive reviews
- Daily/weekly review sync
- Monthly email with content ideas

### Phase 7: Analytics & Reporting
- Advanced analytics dashboard
- Monthly PDF reports
- Agency mode (multi-client management)

---

## 🛠️ Development Tips

### Before Starting Each Step
1. Read the existing code in the files you'll edit
2. Check if helper functions/components already exist
3. Test locally before committing
4. Update this document if you discover new requirements

### Testing Locally
```bash
# Run dev server
npm run dev

# Build to check for errors
npm run build

# Run linter
npm run lint
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/gbp-ui-wiring

# Commit frequently
git add .
git commit -m "feat: add GBP connection display to settings"

# Push to remote
git push origin feature/gbp-ui-wiring
```

---

## 📞 Questions to Ask

If you get stuck, here are questions to ask:

1. **For GBP UI**: "What should the UI look like when a user has no GBP connected?"
2. **For Demo Mode**: "Should demo mode be a separate route or a flag on the user?"
3. **For Analytics**: "What time period should the charts show? (7 days, 30 days, all time?)"
4. **For Plan Gating**: "What should happen when a user hits their limit mid-generation?"

---

**Last Updated**: November 29, 2024  
**Current Focus**: Step 1 - Finish GBP UI Wiring

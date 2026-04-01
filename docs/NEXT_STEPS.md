# LocalLift - Next Steps (Developer Guide)

Actionable priorities aligned with the current codebase (Neon + Auth.js, GBP APIs wired, Settings/Reviews UI largely built).

---

## 🎯 Current Status

**Phase 3: Google Business Profile & polish** – Backend and primary dashboard UI are in place; focus shifts to consistency, demo behavior, analytics, and launch hardening.

- ✅ **Auth & DB**: Auth.js, `public.users` / `public.profiles`, Neon migrations under `neon/migrations/`
- ✅ **GBP**: OAuth, sync, replies, disconnect; Settings shows locations, sync, auto-reply toggle, disconnect; Reviews has location selector, sync, workflow UI (`src/components/reviews/`)
- 🚧 **Product polish**: Demo limits/copy, audit funnel, dashboard charts, QA

---

## 📋 Immediate priorities (in order)

### ▶ STEP 1: Demo mode polish ⭐ **CURRENT PRIORITY**

**Status**: Cookie + middleware + `UpgradeModal` exist; tighten limits and messaging  
**Complexity**: Low

- [ ] Align demo limits with product goals (e.g. cap mock generations/replies) in `src/lib/demo.ts` / consumers
- [ ] Ensure “Post to Google” and paid-only paths are clearly no-op or blocked in demo (reviews + API `x-demo` behavior)
- [ ] Banner copy and dismiss behavior (dashboard layout + demo entry at `/demo`)

**Files to check**: `src/middleware.ts`, `src/lib/demo.ts`, `src/lib/demo-actions.ts`, `src/app/(dashboard)/layout.tsx`, review/content API routes with demo branches

---

### ▶ STEP 2: Plan gating verification

**Status**: `PlanGate`, `UpgradeBanner`, and paid checks exist; audit for gaps  
**Complexity**: Low

- [ ] GBP connect/sync/post: only for paid/trial where intended
- [ ] Content and audit: enforce monthly caps from `profiles`
- [ ] Consistent upgrade CTAs when limits hit

**Files to check**: `src/components/PlanGate.tsx`, dashboard pages, `src/app/api/**` for usage checks

---

### ▶ STEP 3: Audit funnel & marketing

**Status**: `/free-audit` works; conversion UX can improve  
**Complexity**: Low–medium

- [ ] Results layout, CTA to sign up / pricing
- [ ] Optional social proof on funnel pages

**Files**: `src/app/free-audit/**`, related components

---

### ▶ STEP 4: Dashboard analytics

**Status**: Summary API exists; no charts  
**Complexity**: Medium

- [ ] Trends vs previous period (reuse `GET /api/dashboard/summary` or extend)
- [ ] Simple charts (e.g. Recharts) for usage over time

**Files**: `src/app/(dashboard)/dashboard/page.tsx`, new small chart components

---

### ▶ STEP 5: Pre-launch QA

**Status**: Ongoing  
**Complexity**: High (real GBP helps)

- [ ] End-to-end: signup, Stripe trial, GBP connect, sync, draft reply, post reply, disconnect
- [ ] Error logging (e.g. Sentry), Vercel logs review
- [ ] `npm run build` clean; run [docs/SMOKE_TEST_CHECKLIST.md](./SMOKE_TEST_CHECKLIST.md) on staging

---

### ▶ STEP 6: Marketing site (non-blocking)

- [ ] “Why LocalLift?” / case studies / SEO as needed

---

## 🔮 Later phases

See [docs/ROADMAP.md](./ROADMAP.md) for automation (n8n), agency mode, and advanced analytics.

---

## 🛠️ Development tips

```bash
npm run dev
npm run build
npm run lint
```

Neon schema: apply `neon/migrations/*.sql` in order ([neon/README.md](../neon/README.md)).

---

## 📞 Decisions to clarify when implementing

1. **Demo**: Hard caps vs time-based demo?
2. **Analytics**: Default time range for charts (7d vs 30d)?
3. **GBP**: Any locations that should skip auto-reply regardless of profile toggle?

---

**Last updated:** April 2026  
**Current focus:** Step 1 – Demo mode polish and Step 2 – Plan gating verification

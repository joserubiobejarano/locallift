# Smoke Test Checklist for LocalLift Staging

After deploying to Vercel, run through these tests to verify everything works.

## Pre-Test Setup

- [ ] Clear browser cache and cookies (or use incognito/private window)
- [ ] Open browser developer console (F12) to check for errors
- [ ] Note your Vercel staging URL: `https://locallift-staging.vercel.app` (or your actual URL)

## 1. Homepage & Landing Page

- [ ] Visit `/` (root URL)
- [ ] Page loads without errors
- [ ] No console errors in browser dev tools
- [ ] Navigation links work
- [ ] CTA buttons are visible and clickable

## 2. Authentication - Sign Up

- [ ] Visit `/signup`
- [ ] Sign up form is visible
- [ ] Create a test account with email/password
- [ ] Sign up completes successfully
- [ ] Redirects to `/content` after sign up
- [ ] No console errors

## 3. Authentication - Login

- [ ] Visit `/login`
- [ ] Login form is visible
- [ ] Log in with test account credentials
- [ ] Login completes successfully
- [ ] Redirects to `/content` after login
- [ ] No console errors

## 4. Authentication - Google OAuth (Optional)

- [ ] Visit `/login`
- [ ] Click "Continue with Google" button
- [ ] Redirects to Google OAuth consent screen
- [ ] Complete Google OAuth flow
- [ ] Redirects back to `/auth/callback`
- [ ] Then redirects to `/content`
- [ ] User is logged in
- [ ] No console errors

## 5. Dashboard Pages - Content

- [ ] Visit `/content` (while logged in)
- [ ] Page loads without errors
- [ ] Demo mode banner appears (if applicable)
- [ ] Content generation forms are visible
- [ ] No console errors
- [ ] Try generating content (if OpenAI is configured)
- [ ] Check that demo mode indicators are visible

## 6. Dashboard Pages - Reviews

- [ ] Visit `/reviews` (while logged in)
- [ ] Page loads without errors
- [ ] Demo mode banner appears (if applicable)
- [ ] Reviews list/interface is visible
- [ ] No console errors
- [ ] If Google is connected, reviews should sync (optional test)

## 7. Dashboard Pages - Audit

- [ ] Visit `/audit` (while logged in)
- [ ] Page loads without errors
- [ ] Demo mode banner appears (if applicable)
- [ ] Audit interface is visible
- [ ] No console errors
- [ ] Try running a quick audit (if configured)

## 8. Dashboard Pages - Settings

- [ ] Visit `/settings` (while logged in)
- [ ] Page loads without errors
- [ ] Profile information is displayed
- [ ] Plan & Billing section is visible
- [ ] Google Business Profile section is visible
- [ ] No console errors

## 9. Settings - Google Connection (Optional)

- [ ] In `/settings`, click "Connect Google" (if not connected)
- [ ] Redirects to Google OAuth
- [ ] Complete OAuth flow
- [ ] Returns to `/settings?google=connected`
- [ ] Google connection status shows "Connected ✅"
- [ ] "Sync Locations" button is visible
- [ ] No console errors

## 10. Settings - Stripe Integration (Optional)

- [ ] In `/settings`, click "Upgrade" button (if Stripe is configured)
- [ ] Redirects to Stripe Checkout (test mode)
- [ ] Complete or cancel checkout
- [ ] Returns to `/settings`
- [ ] No console errors

## 11. API Routes - Basic Health Check

Test a few API routes directly (optional, for debugging):

- [ ] `GET /api/dashboard/summary` (should require auth, may redirect to login)
- [ ] Check Vercel function logs for any errors

## 12. Error Handling

- [ ] Visit a non-existent route (e.g., `/this-does-not-exist`)
- [ ] 404 page displays (or redirects appropriately)
- [ ] No console errors

## 13. Logout

- [ ] Click logout/sign out button (if available)
- [ ] User is logged out
- [ ] Redirects to login or homepage
- [ ] Session is cleared
- [ ] No console errors

## 14. Demo Mode Verification

- [ ] Verify demo mode banners appear on `/content`, `/reviews`, `/audit`
- [ ] Demo mode indicators are clearly visible
- [ ] App does not crash in demo mode
- [ ] Demo data displays correctly (if applicable)

## 15. Mobile/Responsive Check (Quick)

- [ ] Resize browser window to mobile size
- [ ] Navigation works on mobile
- [ ] Forms are usable on mobile
- [ ] No layout breaking issues

## Post-Test Verification

- [ ] Check Vercel function logs for any errors during testing
- [ ] Check browser console for any persistent errors
- [ ] Verify no 500 errors in network tab
- [ ] All critical user flows work end-to-end

## Known Issues to Document

If you find any issues during smoke testing, document them here:

1. [ ] Issue: ________________
   - Steps to reproduce: ________________
   - Expected: ________________
   - Actual: ________________

2. [ ] Issue: ________________
   - Steps to reproduce: ________________
   - Expected: ________________
   - Actual: ________________

## Sign-off

- [ ] All critical tests passed
- [ ] No blocking issues found
- [ ] Staging environment is ready for use
- [ ] Date: _______________
- [ ] Tester: _______________


# Neon database migrations

**Canonical schema** for LocalLift lives only in `neon/migrations/`. Apply files **in numeric order** in the Neon SQL Editor, `psql`, or your migration runner before relying on new columns or tables.

| File | Purpose |
|------|---------|
| `001_initial.sql` | Core tables: `users`, `profiles`, subscriptions/billing, GBP, `reviews`, `review_replies`, `leads`, `feedback`, etc. |
| `002_auto_reply_profiles.sql` | Ensures `profiles.auto_reply_all_reviews` exists (idempotent if already present from `001_initial`). |

Do **not** use removed legacy migration trees; this folder is the single source of truth.

**Importing data from an old stack:** If you have a CSV or dump from another Postgres instance, map foreign keys to `public.users.id` and load into matching tables after the schema is applied.

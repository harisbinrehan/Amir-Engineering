# Setup Guide

## 1. Local development (no cloud project needed)

The fastest way to run this locally is against the Supabase CLI's local stack (Postgres + Auth + Storage
in Docker) — this is what was used to build and test round 1.

```bash
npm install
npx supabase start       # first run pulls Docker images, takes a few minutes
npx supabase db reset    # applies supabase/migrations/*.sql and supabase/seed.sql
```

`supabase start` prints an `ANON_KEY`, `SERVICE_ROLE_KEY` and `API_URL` (default `http://127.0.0.1:54321`).
Copy `.env.example` to `.env.local` and fill those in:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start>
SUPABASE_SERVICE_ROLE_KEY=<service_role key from supabase start>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then:

```bash
npm run dev
```

### Bootstrapping the first admin (super_admin)

Every new Supabase Auth user gets a `profiles` row with `role = 'customer'` by default (see the
`handle_new_user` trigger in `supabase/migrations/0002_profiles_and_roles.sql`). To get into the admin
portal, sign up once through the app (or Supabase Studio at `http://127.0.0.1:54323` locally), then
promote that user directly in SQL:

```sql
update profiles set role = 'super_admin' where id = '<the user''s auth.users id>';
```

From then on they can sign in at `/admin/login` and, once the Users module is built, promote further
staff accounts through the UI. `update_user_role()` (in `0011_helper_functions.sql`) is the only
sanctioned way to change a role from application code — it's a `security definer` RPC restricted to
`super_admin`.

## 2. Creating the real Supabase project

1. Create a project at [supabase.com](https://supabase.com/dashboard).
2. Push this repo's schema to it:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
   (Skip `seed.sql` in production — it's placeholder demo data for local dev only.)
3. In **Project Settings → API**, copy the Project URL, `anon` key and `service_role` key into your
   environment variables (see below). **The service role key must never be exposed to the browser** —
   it only belongs in `SUPABASE_SERVICE_ROLE_KEY` (no `NEXT_PUBLIC_` prefix), read only from Server
   Actions/Server Components (`src/lib/supabase/server.ts`'s `createServiceRoleClient`).
4. In **Authentication → URL Configuration**, set the Site URL and redirect URLs to your Vercel domain
   once deployed.
5. Create the Storage buckets the schema expects as usage grows: `product-images`, `machinery-images`,
   `production-line-images`, `project-images`, `receipts`, `brochures`, `cms`. (Not required for round 1
   — the media library UI that uploads into them ships in a later round.)

## 3. Deploying to Vercel

This repo was scaffolded with a Vercel project already linked (see `.vercel/` after `vercel link`, and
the `VERCEL_OIDC_TOKEN` in `.env.local` if you've run `vercel env pull`). To deploy:

```bash
npx vercel          # preview deployment
npx vercel --prod    # production deployment
```

Set these environment variables in the Vercel project (Project Settings → Environment Variables), for
both Preview and Production:

| Variable | Value | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | **No — server only** |
| `NEXT_PUBLIC_SITE_URL` | Your production domain, e.g. `https://www.amirengineering.com` | Yes |

## 4. What's real vs. placeholder in this round

- **Real, end to end**: homepage, machinery catalog/category/detail, the Request-a-Quote flow (writes to
  Supabase, generates a reference number, RLS-verified), customer sign up/sign in, admin sign in +
  role-gated layout, and the full admin Quotes module (list, filter, status changes with automatic
  history logging, internal notes, staff assignment, estimated price).
- **Schema-ready, UI pending**: Shop/checkout, Orders, Inventory, Expenses, Finance reporting, CMS,
  Media Library, Users & Staff management, Projects/Blog. Their tables, RLS policies and admin nav
  entries already exist (see `supabase/migrations/`) — each just needs its management UI built.
- **Placeholder content**: all homepage/about copy (`src/lib/content/placeholder-copy.ts`) and imagery
  (seeded via picsum.photos through `PlaceholderImage`/`placeholder-images.ts`) — swap these out, or
  build the CMS module to manage them from the admin portal, before launch.

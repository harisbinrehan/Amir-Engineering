# Amir Engineering

Public website, e-commerce and admin portal for Amir Engineering — a manufacturer of food-processing
machinery (noodle, macaroni, pasta, vermicelli) and finished food products.

This is round 1 of the build ("Foundation"): project scaffolding, the full database schema, auth/RBAC,
the design system, a real homepage, a complete machinery → quote-request vertical slice, and a working
admin Quotes module. Every other module (Shop, Orders, Expenses, Finance, CMS, etc.) already has its
schema and RLS policies in place, with a placeholder page in both the public site and admin portal so
navigation has no dead ends — building out each module's UI is future-round work.

See **[SETUP.md](./SETUP.md)** for how to get this running locally and deployed to Vercel.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui (Radix UI base)
- Supabase (Postgres, Auth, Storage, Row Level Security)
- react-hook-form + zod for forms/validation
- motion (Framer Motion) for animation
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

Requires a `.env.local` with Supabase credentials — see SETUP.md. For local development against a
throwaway Supabase instance (no cloud project needed), use the Supabase CLI:

```bash
npx supabase start   # spins up Postgres + Auth + Storage in Docker
npx supabase db reset  # applies all migrations + seed data
```

## Project structure

```
supabase/migrations/   Database schema, in order (0001…0012)
supabase/seed.sql       Placeholder demo data
src/app/(public)/       Public marketing site, machinery, production lines, quote flow
src/app/(public)/(shop) Cart/checkout (stub)
src/app/(public)/(account) Customer auth + account area
src/app/admin/           Staff-only admin portal (role-gated)
src/lib/supabase/        Browser/server/proxy Supabase clients
src/lib/auth/            Profile + role helpers
src/lib/data/            Read-only Supabase query layer
src/lib/actions/         Server Actions (writes)
src/lib/content/         Placeholder copy/nav — swap for real content later
```

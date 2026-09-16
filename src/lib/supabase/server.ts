import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * Server-side Supabase client — use from Server Components, Server Actions
 * and Route Handlers. Must be created fresh per request (do not cache/reuse
 * across requests, and never share with the browser client in client.ts).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component that can't set cookies — safe to
            // ignore as long as proxy.ts refreshes the session on navigation.
          }
        },
      },
    },
  );
}

/**
 * Anon-key client that never touches cookies — for public, unauthenticated
 * catalog reads only (machinery, products, production lines, categories).
 * `createClient()` calls `cookies()`, which forces Next.js to render the
 * whole route dynamically on every request even when the page sets
 * `export const revalidate`; those pages don't need a session at all (RLS
 * gives every visitor the same public rows), so this client lets them
 * actually get cached/ISR'd instead of hitting Supabase on every navigation.
 */
export function createPublicClient() {
  return createSupabaseJsClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/**
 * Service-role Supabase client — bypasses Row Level Security entirely.
 * Server-only (never imported by a Client Component). Reserved for trusted
 * server-side operations such as writing audit_logs.
 */
export function createServiceRoleClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  );
}

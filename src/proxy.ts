import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  /*
   * Only /admin and /account need a server-verified session on every
   * request (the admin gate here, and cookie refresh for logged-in account
   * pages). Every other route — the entire public site, the shop, quotes —
   * doesn't touch auth at all, so it must never pay for a round trip to the
   * Supabase Auth server on each navigation. Running this on every route
   * (as a catch-all matcher previously did) was adding a network call
   * before every single page load, including fully anonymous browsing.
   */
  matcher: ["/admin/:path*", "/account/:path*"],
};

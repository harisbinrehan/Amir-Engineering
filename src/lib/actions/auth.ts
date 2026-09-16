"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/content/site-config";

type ActionResult = { success: true } | { success: false; error: string };

export async function signInWithPassword(email: string, password: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function signUpWithPassword(
  fullName: string,
  email: string,
  password: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Requires the Google provider to be enabled in the Supabase dashboard
 * (Authentication → Providers → Google) with your own Google OAuth client
 * ID/secret — this code has no effect until that's configured there.
 */
export async function signInWithGoogle(redirectPath = "/account") {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${siteConfig.url}/auth/callback?next=${encodeURIComponent(redirectPath)}` },
  });

  if (error || !data.url) {
    redirect("/login?error=google-oauth-unavailable");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

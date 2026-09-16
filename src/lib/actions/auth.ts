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

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteConfig.url}/account/set-password`,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
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

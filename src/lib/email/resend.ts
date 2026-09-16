import { Resend } from "resend";

let client: Resend | null = null;

/**
 * Lazily constructed so a missing RESEND_API_KEY (e.g. local dev without the
 * key set) doesn't crash the module graph — only the actual send call fails,
 * and callers already treat email sending as best-effort.
 */
export function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL ?? "Amir Engineering <onboarding@resend.dev>";

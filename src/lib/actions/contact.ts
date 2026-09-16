"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { contactInquirySchema } from "@/lib/validation/contact-schema";
import type { Enums } from "@/types/database.types";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createContactInquiry(input: unknown): Promise<ActionResult> {
  const parsed = contactInquirySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { website, ...values } = parsed.data;
  if (website) {
    // Honeypot tripped — report success to the bot without writing anything.
    return { success: true, data: undefined };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_inquiries").insert({
    full_name: values.fullName,
    email: values.email,
    phone: values.phone || null,
    subject: values.subject || null,
    message: values.message,
  });

  if (error) {
    return { success: false, error: "Could not send your message. Please try again or contact us directly." };
  }

  return { success: true, data: undefined };
}

export async function updateContactInquiryStatus(
  inquiryId: string,
  status: Enums<"contact_inquiry_status">,
): Promise<ActionResult> {
  await requireRole(["super_admin", "admin", "sales"]);

  const supabase = await createClient();
  const { error } = await supabase.from("contact_inquiries").update({ status }).eq("id", inquiryId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/contact");
  return { success: true, data: undefined };
}

export async function deleteContactInquiry(inquiryId: string): Promise<ActionResult> {
  await requireRole(["super_admin", "admin", "sales"]);

  const supabase = await createClient();
  const { error } = await supabase.from("contact_inquiries").delete().eq("id", inquiryId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/contact");
  return { success: true, data: undefined };
}

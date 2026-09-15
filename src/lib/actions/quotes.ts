"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { quoteRequestSchema } from "@/lib/validation/quote-schema";
import type { Enums } from "@/types/database.types";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createQuoteRequest(
  input: unknown,
): Promise<ActionResult<{ referenceNumber: string }>> {
  const parsed = quoteRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { website, ...values } = parsed.data;
  if (website) {
    // Honeypot tripped — report success to the bot without writing anything.
    return { success: true, data: { referenceNumber: "QT-0000-000000" } };
  }

  if (!values.machineryId && !values.productionLineId) {
    return { success: false, error: "Select a machine or production line" };
  }

  const supabase = await createClient();

  const { data: reference, error: referenceError } = await supabase.rpc(
    "generate_quote_reference",
  );
  if (referenceError || !reference) {
    return { success: false, error: "Could not generate a quote reference. Please try again." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Insert without .select() — an anonymous submitter has no SELECT policy on
  // `quotes`, and Postgres raises an RLS error on INSERT ... RETURNING when
  // the new row isn't visible back to the caller. Generating the id
  // ourselves avoids needing it returned at all.
  const quoteId = crypto.randomUUID();

  const { error: quoteError } = await supabase.from("quotes").insert({
    id: quoteId,
    reference_number: reference,
    full_name: values.fullName,
    company_name: values.companyName || null,
    email: values.email,
    phone: values.phone,
    country: values.country || "Pakistan",
    city: values.city || null,
    message: values.message || null,
    profile_id: user?.id ?? null,
  });

  if (quoteError) {
    return { success: false, error: "Could not submit your quote request. Please try again." };
  }

  const { error: itemError } = await supabase.from("quote_items").insert({
    quote_id: quoteId,
    machinery_id: values.machineryId ?? null,
    production_line_id: values.productionLineId ?? null,
    quantity: values.quantity,
    required_capacity: values.requiredCapacity || null,
  });

  if (itemError) {
    return { success: false, error: "Your quote was started but the item could not be saved." };
  }

  return { success: true, data: { referenceNumber: reference } };
}

export async function updateQuoteStatus(
  quoteId: string,
  status: Enums<"quote_status">,
): Promise<ActionResult> {
  await requireRole(["super_admin", "admin", "sales"]);

  const supabase = await createClient();
  const { error } = await supabase.from("quotes").update({ status }).eq("id", quoteId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/quotes/${quoteId}`);
  revalidatePath("/admin/quotes");
  return { success: true, data: undefined };
}

export async function assignQuote(quoteId: string, assignedTo: string | null): Promise<ActionResult> {
  await requireRole(["super_admin", "admin", "sales"]);

  const supabase = await createClient();
  const { error } = await supabase
    .from("quotes")
    .update({ assigned_to: assignedTo })
    .eq("id", quoteId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/quotes/${quoteId}`);
  revalidatePath("/admin/quotes");
  return { success: true, data: undefined };
}

export async function setQuoteEstimatedPrice(
  quoteId: string,
  estimatedPrice: number | null,
): Promise<ActionResult> {
  await requireRole(["super_admin", "admin", "sales"]);

  const supabase = await createClient();
  const { error } = await supabase
    .from("quotes")
    .update({ estimated_price: estimatedPrice })
    .eq("id", quoteId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/quotes/${quoteId}`);
  return { success: true, data: undefined };
}

export async function addQuoteNote(quoteId: string, note: string): Promise<ActionResult> {
  const session = await requireRole(["super_admin", "admin", "sales"]);

  const trimmed = note.trim();
  if (!trimmed) return { success: false, error: "Note cannot be empty" };

  const supabase = await createClient();
  const { error } = await supabase.from("quote_notes").insert({
    quote_id: quoteId,
    author_id: session.profile.id,
    note: trimmed,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/quotes/${quoteId}`);
  return { success: true, data: undefined };
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { testimonialSchema, faqSchema } from "@/lib/validation/cms-schema";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

const CONTENT_ROLES = ["super_admin", "admin", "content_manager"] as const;

export async function createTestimonial(input: unknown): Promise<ActionResult> {
  await requireRole([...CONTENT_ROLES]);

  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("testimonials").insert({
    author_name: values.authorName,
    author_title: values.authorTitle || null,
    company_name: values.companyName || null,
    quote: values.quote,
    rating: values.rating ?? null,
    is_published: values.isPublished,
    sort_order: values.sortOrder,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/cms");
  revalidatePath("/");
  return { success: true, data: undefined };
}

export async function updateTestimonial(testimonialId: string, input: unknown): Promise<ActionResult> {
  await requireRole([...CONTENT_ROLES]);

  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("testimonials")
    .update({
      author_name: values.authorName,
      author_title: values.authorTitle || null,
      company_name: values.companyName || null,
      quote: values.quote,
      rating: values.rating ?? null,
      is_published: values.isPublished,
      sort_order: values.sortOrder,
    })
    .eq("id", testimonialId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/cms");
  revalidatePath("/");
  return { success: true, data: undefined };
}

export async function deleteTestimonial(testimonialId: string): Promise<ActionResult> {
  await requireRole([...CONTENT_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", testimonialId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/cms");
  revalidatePath("/");
  return { success: true, data: undefined };
}

export async function createFaq(input: unknown): Promise<ActionResult> {
  await requireRole([...CONTENT_ROLES]);

  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("faqs").insert({
    question: values.question,
    answer: values.answer,
    category: values.category || null,
    is_published: values.isPublished,
    sort_order: values.sortOrder,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/cms");
  return { success: true, data: undefined };
}

export async function updateFaq(faqId: string, input: unknown): Promise<ActionResult> {
  await requireRole([...CONTENT_ROLES]);

  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("faqs")
    .update({
      question: values.question,
      answer: values.answer,
      category: values.category || null,
      is_published: values.isPublished,
      sort_order: values.sortOrder,
    })
    .eq("id", faqId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/cms");
  return { success: true, data: undefined };
}

export async function deleteFaq(faqId: string): Promise<ActionResult> {
  await requireRole([...CONTENT_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", faqId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/cms");
  return { success: true, data: undefined };
}

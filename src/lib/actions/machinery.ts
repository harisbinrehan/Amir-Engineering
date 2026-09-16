"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { machinerySchema, specificationSchema } from "@/lib/validation/machinery-schema";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

const CATALOG_ROLES = ["super_admin", "admin"] as const;

export async function createMachinery(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireRole([...CATALOG_ROLES]);

  const parsed = machinerySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("machinery")
    .insert({
      name: values.name,
      slug: values.slug,
      category_id: values.categoryId || null,
      short_description: values.shortDescription || null,
      description: values.description || null,
      capacity: values.capacity || null,
      power_requirement: values.powerRequirement || null,
      dimensions: values.dimensions || null,
      weight: values.weight || null,
      voltage: values.voltage || null,
      material: values.material || null,
      image_url: values.imageUrl || null,
      brochure_url: values.brochureUrl || null,
      is_active: values.isActive,
      is_featured: values.isFeatured,
      seo_title: values.seoTitle || null,
      seo_description: values.seoDescription || null,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/machinery");
  revalidatePath("/machinery");
  return { success: true, data: { id: data.id } };
}

export async function updateMachinery(machineryId: string, input: unknown): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const parsed = machinerySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("machinery")
    .update({
      name: values.name,
      slug: values.slug,
      category_id: values.categoryId || null,
      short_description: values.shortDescription || null,
      description: values.description || null,
      capacity: values.capacity || null,
      power_requirement: values.powerRequirement || null,
      dimensions: values.dimensions || null,
      weight: values.weight || null,
      voltage: values.voltage || null,
      material: values.material || null,
      image_url: values.imageUrl || null,
      brochure_url: values.brochureUrl || null,
      is_active: values.isActive,
      is_featured: values.isFeatured,
      seo_title: values.seoTitle || null,
      seo_description: values.seoDescription || null,
    })
    .eq("id", machineryId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/machinery");
  revalidatePath(`/admin/machinery/${machineryId}`);
  revalidatePath("/machinery");
  return { success: true, data: undefined };
}

export async function deleteMachinery(machineryId: string): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase
    .from("machinery")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", machineryId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/machinery");
  revalidatePath("/machinery");
  return { success: true, data: undefined };
}

export async function createSpecification(machineryId: string, input: unknown): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const parsed = specificationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("machinery_specifications").insert({
    machinery_id: machineryId,
    spec_group: values.specGroup,
    label: values.label,
    value: values.value,
    sort_order: values.sortOrder,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/machinery/${machineryId}`);
  revalidatePath("/machinery");
  return { success: true, data: undefined };
}

export async function updateSpecification(
  specId: string,
  machineryId: string,
  input: unknown,
): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const parsed = specificationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("machinery_specifications")
    .update({
      spec_group: values.specGroup,
      label: values.label,
      value: values.value,
      sort_order: values.sortOrder,
    })
    .eq("id", specId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/machinery/${machineryId}`);
  revalidatePath("/machinery");
  return { success: true, data: undefined };
}

export async function deleteSpecification(specId: string, machineryId: string): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("machinery_specifications").delete().eq("id", specId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/machinery/${machineryId}`);
  revalidatePath("/machinery");
  return { success: true, data: undefined };
}

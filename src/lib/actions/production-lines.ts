"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { productionLineSchema, stageSchema, lineMachineSchema } from "@/lib/validation/production-line-schema";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

const CATALOG_ROLES = ["super_admin", "admin"] as const;

export async function createProductionLine(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireRole([...CATALOG_ROLES]);

  const parsed = productionLineSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("production_lines")
    .insert({
      name: values.name,
      slug: values.slug,
      short_description: values.shortDescription || null,
      description: values.description || null,
      capacity: values.capacity || null,
      required_space: values.requiredSpace || null,
      power_requirement: values.powerRequirement || null,
      image_url: values.imageUrl || null,
      brochure_url: values.brochureUrl || null,
      is_active: values.isActive,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/production-lines");
  revalidatePath("/production-lines");
  return { success: true, data: { id: data.id } };
}

export async function updateProductionLine(lineId: string, input: unknown): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const parsed = productionLineSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("production_lines")
    .update({
      name: values.name,
      slug: values.slug,
      short_description: values.shortDescription || null,
      description: values.description || null,
      capacity: values.capacity || null,
      required_space: values.requiredSpace || null,
      power_requirement: values.powerRequirement || null,
      image_url: values.imageUrl || null,
      brochure_url: values.brochureUrl || null,
      is_active: values.isActive,
    })
    .eq("id", lineId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/production-lines");
  revalidatePath(`/admin/production-lines/${lineId}`);
  revalidatePath("/production-lines");
  return { success: true, data: undefined };
}

export async function deleteProductionLine(lineId: string): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase
    .from("production_lines")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", lineId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/production-lines");
  revalidatePath("/production-lines");
  return { success: true, data: undefined };
}

export async function createStage(lineId: string, input: unknown): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const parsed = stageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("production_line_stages").insert({
    production_line_id: lineId,
    name: values.name,
    description: values.description || null,
    sort_order: values.sortOrder,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/production-lines/${lineId}`);
  revalidatePath("/production-lines");
  return { success: true, data: undefined };
}

export async function updateStage(stageId: string, lineId: string, input: unknown): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const parsed = stageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("production_line_stages")
    .update({ name: values.name, description: values.description || null, sort_order: values.sortOrder })
    .eq("id", stageId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/production-lines/${lineId}`);
  revalidatePath("/production-lines");
  return { success: true, data: undefined };
}

export async function deleteStage(stageId: string, lineId: string): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("production_line_stages").delete().eq("id", stageId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/production-lines/${lineId}`);
  revalidatePath("/production-lines");
  return { success: true, data: undefined };
}

export async function createLineMachine(lineId: string, input: unknown): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const parsed = lineMachineSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("production_line_machines").insert({
    production_line_id: lineId,
    machinery_id: values.machineryId,
    stage_id: values.stageId || null,
    quantity: values.quantity,
    sort_order: values.sortOrder,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/production-lines/${lineId}`);
  revalidatePath("/production-lines");
  return { success: true, data: undefined };
}

export async function updateLineMachine(entryId: string, lineId: string, input: unknown): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const parsed = lineMachineSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("production_line_machines")
    .update({
      machinery_id: values.machineryId,
      stage_id: values.stageId || null,
      quantity: values.quantity,
      sort_order: values.sortOrder,
    })
    .eq("id", entryId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/production-lines/${lineId}`);
  revalidatePath("/production-lines");
  return { success: true, data: undefined };
}

export async function deleteLineMachine(entryId: string, lineId: string): Promise<ActionResult> {
  await requireRole([...CATALOG_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("production_line_machines").delete().eq("id", entryId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/production-lines/${lineId}`);
  revalidatePath("/production-lines");
  return { success: true, data: undefined };
}

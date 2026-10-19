"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { logAudit } from "@/lib/audit";
import { idSchema } from "@/lib/validation/id-schema";
import { z } from "zod";

const CATALOG_ROLES = ["super_admin", "admin"] as const;

type RowResult = { id: string; name: string; success: boolean; error?: string };
type BulkResult = { results: RowResult[]; succeeded: number; failed: number };

// idSchema (not zod's strict .uuid()) — this project's seed data uses
// "vanity" ids like 66666666-6666-6666-6666-666666666601, which are valid
// Postgres uuids but fail RFC 4122's variant-nibble check. .uuid() silently
// rejects every real row id here, so bulk actions would validate-fail,
// return zero results, and still read as "succeeded" to the caller.
const idsSchema = z.array(idSchema).min(1).max(500);

export async function bulkUpdateStatus(productIds: string[], isActive: boolean): Promise<BulkResult> {
  const session = await requireRole([...CATALOG_ROLES]);
  const parsed = idsSchema.safeParse(productIds);
  if (!parsed.success) return { results: [], succeeded: 0, failed: 0 };

  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("id, name").in("id", parsed.data);
  const results: RowResult[] = [];

  for (const p of products ?? []) {
    const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", p.id);
    results.push({ id: p.id, name: p.name, success: !error, error: error?.message });
    if (!error) {
      await logAudit({
        actorId: session.profile.id,
        action: "bulk_update",
        entityType: "product",
        entityId: p.id,
        diff: { after: { is_active: isActive } },
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { results, succeeded: results.filter((r) => r.success).length, failed: results.filter((r) => !r.success).length };
}

export async function bulkUpdateCategory(productIds: string[], categoryId: string): Promise<BulkResult> {
  const session = await requireRole([...CATALOG_ROLES]);
  const parsed = idsSchema.safeParse(productIds);
  if (!parsed.success || !categoryId) return { results: [], succeeded: 0, failed: 0 };

  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("id, name").in("id", parsed.data);
  const results: RowResult[] = [];

  for (const p of products ?? []) {
    const { error } = await supabase.from("products").update({ category_id: categoryId }).eq("id", p.id);
    results.push({ id: p.id, name: p.name, success: !error, error: error?.message });
    if (!error) {
      await logAudit({
        actorId: session.profile.id,
        action: "bulk_update",
        entityType: "product",
        entityId: p.id,
        diff: { after: { category_id: categoryId } },
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { results, succeeded: results.filter((r) => r.success).length, failed: results.filter((r) => !r.success).length };
}

export type PriceAdjustMode = "percentage" | "fixed";
export type PriceAdjustDirection = "increase" | "decrease";

function applyAdjustment(current: number, mode: PriceAdjustMode, direction: PriceAdjustDirection, value: number) {
  const delta = mode === "percentage" ? current * (value / 100) : value;
  const signed = direction === "increase" ? delta : -delta;
  return Math.max(0, Math.round((current + signed) * 100) / 100);
}

/**
 * Preview only — computes before/after for each selected product (and its
 * variants) without writing anything, so the UI can show a confirmation
 * table before the admin commits.
 */
export async function previewBulkPriceAdjustment(
  productIds: string[],
  mode: PriceAdjustMode,
  direction: PriceAdjustDirection,
  value: number,
) {
  await requireRole([...CATALOG_ROLES]);
  const parsed = idsSchema.safeParse(productIds);
  if (!parsed.success || value <= 0) return [];

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, base_price, variants:product_variants(id, sku, price)")
    .in("id", parsed.data);

  return (products ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    basePriceBefore: Number(p.base_price),
    basePriceAfter: applyAdjustment(Number(p.base_price), mode, direction, value),
    variants: p.variants
      .filter((v) => v.price !== null)
      .map((v) => ({
        id: v.id,
        sku: v.sku,
        priceBefore: Number(v.price),
        priceAfter: applyAdjustment(Number(v.price), mode, direction, value),
      })),
  }));
}

export async function bulkAdjustPrice(
  productIds: string[],
  mode: PriceAdjustMode,
  direction: PriceAdjustDirection,
  value: number,
): Promise<BulkResult> {
  const session = await requireRole([...CATALOG_ROLES]);
  const parsed = idsSchema.safeParse(productIds);
  if (!parsed.success || value <= 0) return { results: [], succeeded: 0, failed: 0 };

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, base_price, variants:product_variants(id, price)")
    .in("id", parsed.data);

  const results: RowResult[] = [];

  for (const p of products ?? []) {
    const newBasePrice = applyAdjustment(Number(p.base_price), mode, direction, value);
    const { error } = await supabase.from("products").update({ base_price: newBasePrice }).eq("id", p.id);

    let variantError: string | undefined;
    for (const v of p.variants) {
      if (v.price === null) continue;
      const newVariantPrice = applyAdjustment(Number(v.price), mode, direction, value);
      const { error: vErr } = await supabase.from("product_variants").update({ price: newVariantPrice }).eq("id", v.id);
      if (vErr) variantError = vErr.message;
    }

    const success = !error && !variantError;
    results.push({ id: p.id, name: p.name, success, error: error?.message ?? variantError });
    if (success) {
      await logAudit({
        actorId: session.profile.id,
        action: "bulk_update",
        entityType: "product",
        entityId: p.id,
        diff: { before: { base_price: p.base_price }, after: { base_price: newBasePrice } },
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { results, succeeded: results.filter((r) => r.success).length, failed: results.filter((r) => !r.success).length };
}

/**
 * Bulk stock set — only applied to products with exactly one variant, since
 * stock lives on variants and a multi-variant product has no single
 * unambiguous "the" stock figure to bulk-set. Multi-variant products are
 * reported as skipped rather than silently guessed at.
 */
export async function bulkSetStock(productIds: string[], newStock: number): Promise<BulkResult> {
  const session = await requireRole([...CATALOG_ROLES]);
  const parsed = idsSchema.safeParse(productIds);
  if (!parsed.success || newStock < 0) return { results: [], succeeded: 0, failed: 0 };

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, variants:product_variants(id, stock_quantity)")
    .in("id", parsed.data);

  const results: RowResult[] = [];

  for (const p of products ?? []) {
    if (p.variants.length !== 1) {
      results.push({ id: p.id, name: p.name, success: false, error: "Skipped: multiple variants, edit individually" });
      continue;
    }
    const variant = p.variants[0];
    const { error } = await supabase.rpc("adjust_variant_stock", {
      p_variant_id: variant.id,
      p_change_qty: newStock - variant.stock_quantity,
      p_reason: "Bulk stock update",
      p_created_by: session.profile.id,
    });
    results.push({ id: p.id, name: p.name, success: !error, error: error?.message });
    if (!error) {
      await logAudit({
        actorId: session.profile.id,
        action: "bulk_update",
        entityType: "product",
        entityId: p.id,
        diff: { before: { stock: variant.stock_quantity }, after: { stock: newStock } },
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
  return { results, succeeded: results.filter((r) => r.success).length, failed: results.filter((r) => !r.success).length };
}

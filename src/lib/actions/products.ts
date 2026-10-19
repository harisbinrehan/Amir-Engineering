"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { productSchema, variantSchema } from "@/lib/validation/product-schema";
import { logAudit } from "@/lib/audit";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

const CATALOG_ROLES = ["super_admin", "admin"] as const;

export async function createProduct(input: unknown): Promise<ActionResult<{ id: string }>> {
  const session = await requireRole([...CATALOG_ROLES]);

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: values.name,
      slug: values.slug,
      category_id: values.categoryId || null,
      short_description: values.shortDescription || null,
      description: values.description || null,
      base_price: values.basePrice,
      image_url: values.imageUrl || null,
      is_active: values.isActive,
      is_featured: values.isFeatured,
      seo_title: values.seoTitle || null,
      seo_description: values.seoDescription || null,
      created_by: session.profile.id,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  await logAudit({
    actorId: session.profile.id,
    action: "create",
    entityType: "product",
    entityId: data.id,
    diff: { after: values },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true, data: { id: data.id } };
}

export async function updateProduct(productId: string, input: unknown): Promise<ActionResult> {
  const session = await requireRole([...CATALOG_ROLES]);

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { data: before } = await supabase
    .from("products")
    .select("name, base_price, is_active, is_featured, category_id")
    .eq("id", productId)
    .single();

  const { error } = await supabase
    .from("products")
    .update({
      name: values.name,
      slug: values.slug,
      category_id: values.categoryId || null,
      short_description: values.shortDescription || null,
      description: values.description || null,
      base_price: values.basePrice,
      image_url: values.imageUrl || null,
      is_active: values.isActive,
      is_featured: values.isFeatured,
      seo_title: values.seoTitle || null,
      seo_description: values.seoDescription || null,
    })
    .eq("id", productId);

  if (error) return { success: false, error: error.message };

  await logAudit({
    actorId: session.profile.id,
    action: "update",
    entityType: "product",
    entityId: productId,
    diff: {
      before,
      after: {
        name: values.name,
        base_price: values.basePrice,
        is_active: values.isActive,
        is_featured: values.isFeatured,
        category_id: values.categoryId || null,
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/products");
  return { success: true, data: undefined };
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  const session = await requireRole([...CATALOG_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", productId);

  if (error) return { success: false, error: error.message };

  await logAudit({ actorId: session.profile.id, action: "delete", entityType: "product", entityId: productId });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true, data: undefined };
}

export async function createVariant(productId: string, input: unknown): Promise<ActionResult> {
  const session = await requireRole([...CATALOG_ROLES]);

  const parsed = variantSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("product_variants").insert({
    product_id: productId,
    sku: values.sku,
    label: values.label || null,
    price: values.price ?? null,
    weight_grams: values.weightGrams ?? null,
    stock_quantity: values.stockQuantity,
    low_stock_threshold: values.lowStockThreshold,
    is_active: values.isActive,
  });

  if (error) return { success: false, error: error.message };

  await logAudit({
    actorId: session.profile.id,
    action: "create",
    entityType: "product",
    entityId: productId,
    diff: { after: { variant_sku: values.sku, variant_stock: values.stockQuantity } },
  });

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/products");
  return { success: true, data: undefined };
}

export async function updateVariant(variantId: string, productId: string, input: unknown): Promise<ActionResult> {
  const session = await requireRole([...CATALOG_ROLES]);

  const parsed = variantSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { data: before } = await supabase
    .from("product_variants")
    .select("sku, price, stock_quantity, is_active")
    .eq("id", variantId)
    .single();

  const { error } = await supabase
    .from("product_variants")
    .update({
      sku: values.sku,
      label: values.label || null,
      price: values.price ?? null,
      weight_grams: values.weightGrams ?? null,
      stock_quantity: values.stockQuantity,
      low_stock_threshold: values.lowStockThreshold,
      is_active: values.isActive,
    })
    .eq("id", variantId);

  if (error) return { success: false, error: error.message };

  await logAudit({
    actorId: session.profile.id,
    action: "update",
    entityType: "product",
    entityId: productId,
    diff: {
      before,
      after: { sku: values.sku, price: values.price, stock_quantity: values.stockQuantity, is_active: values.isActive },
    },
  });

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/products");
  return { success: true, data: undefined };
}

export async function deleteVariant(variantId: string, productId: string): Promise<ActionResult> {
  const session = await requireRole([...CATALOG_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("product_variants").delete().eq("id", variantId);

  if (error) return { success: false, error: error.message };

  await logAudit({
    actorId: session.profile.id,
    action: "delete",
    entityType: "product",
    entityId: productId,
    diff: { after: { deleted_variant_id: variantId } },
  });

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/products");
  return { success: true, data: undefined };
}

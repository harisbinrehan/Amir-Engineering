"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { checkoutSchema, cartLineInputSchema } from "@/lib/validation/checkout-schema";
import { siteConfig } from "@/lib/content/site-config";
import { getOrderByNumberAndEmail } from "@/lib/data/orders";
import { requireRole } from "@/lib/auth/require-role";
import { z } from "zod";
import type { Enums } from "@/types/database.types";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

const placeOrderInputSchema = z.object({
  checkout: checkoutSchema,
  lines: z.array(cartLineInputSchema).min(1, "Your cart is empty"),
});

export async function placeOrder(input: unknown): Promise<ActionResult<{ orderNumber: string }>> {
  const parsed = placeOrderInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { checkout, lines } = parsed.data;
  const { website, ...values } = checkout;
  if (website) {
    // Honeypot tripped — report success to the bot without writing anything.
    return { success: true, data: { orderNumber: "ORD-0000-000000" } };
  }

  const supabase = await createClient();
  const admin = createServiceRoleClient();

  const { data: orderNumber, error: numberError } = await supabase.rpc("generate_order_number");
  if (numberError || !orderNumber) {
    return { success: false, error: "Could not generate an order number. Please try again." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Guest checkout: resolve (or create) a real account for the order's email
  // so the order is trackable afterward, instead of being stranded with no
  // profile. A brand-new email gets invited (Supabase emails them a
  // "set your password" link) AND the current browser is logged into it
  // immediately, so they land on the confirmation page already signed in.
  //
  // An email that ALREADY has an account is only linked silently — we never
  // log the current browser into an existing account just because someone
  // typed that email at checkout, since that would let anyone hijack a
  // stranger's account by "ordering" with their address.
  let profileId = user?.id ?? null;
  if (!profileId) {
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(values.email, {
      data: { full_name: values.fullName },
      redirectTo: `${siteConfig.url}/account/set-password`,
    });

    if (!inviteError && invited.user) {
      profileId = invited.user.id;

      const { data: link } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email: values.email,
      });
      const hashedToken = link?.properties?.hashed_token;
      if (hashedToken) {
        await supabase.auth.verifyOtp({ token_hash: hashedToken, type: "magiclink" });
      }
    } else {
      const { data: existing } = await admin.auth.admin.generateLink({
        type: "recovery",
        email: values.email,
      });
      profileId = existing?.user?.id ?? null;
    }
  }

  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  // Written via the service role, not the caller's session — profileId may
  // belong to an account the current (often anonymous) request has no
  // session for, which the normal RLS insert policy wouldn't allow. Input is
  // already validated above, so bypassing RLS here is safe.
  const orderId = crypto.randomUUID();

  const { error: orderError } = await admin.from("orders").insert({
    id: orderId,
    order_number: orderNumber,
    profile_id: profileId,
    payment_method: values.paymentMethod,
    contact_name: values.fullName,
    contact_email: values.email,
    contact_phone: values.phone,
    shipping_address_line1: values.addressLine1,
    shipping_address_line2: values.addressLine2 || null,
    shipping_city: values.city,
    shipping_province: values.province || null,
    shipping_postal_code: values.postalCode || null,
    notes: values.notes || null,
    subtotal,
    shipping_fee: 0,
    total: subtotal,
  });

  if (orderError) {
    return { success: false, error: "Could not place your order. Please try again." };
  }

  const { error: itemsError } = await admin.from("order_items").insert(
    lines.map((line) => ({
      order_id: orderId,
      variant_id: line.variantId,
      product_name: line.productName,
      variant_label: line.variantLabel,
      quantity: line.quantity,
      unit_price: line.unitPrice,
      line_total: line.unitPrice * line.quantity,
    })),
  );

  if (itemsError) {
    return { success: false, error: "Your order was started but the items could not be saved." };
  }

  return { success: true, data: { orderNumber } };
}

const trackOrderInputSchema = z.object({
  orderNumber: z.string().trim().min(1, "Enter your order number"),
  email: z.string().trim().email("Enter a valid email address"),
});

export async function trackOrder(
  input: unknown,
): Promise<ActionResult<Awaited<ReturnType<typeof getOrderByNumberAndEmail>>>> {
  const parsed = trackOrderInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const order = await getOrderByNumberAndEmail(parsed.data.orderNumber, parsed.data.email);
  if (!order) {
    return { success: false, error: "No order found with that order number and email." };
  }

  return { success: true, data: order };
}

export async function updateOrderStatus(orderId: string, status: Enums<"order_status">): Promise<ActionResult> {
  await requireRole(["super_admin", "admin", "sales"]);

  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { success: true, data: undefined };
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: Enums<"payment_status">,
): Promise<ActionResult> {
  await requireRole(["super_admin", "admin", "sales", "finance"]);

  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ payment_status: paymentStatus }).eq("id", orderId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { success: true, data: undefined };
}

export async function updateOrderTracking(orderId: string, trackingNumber: string): Promise<ActionResult> {
  await requireRole(["super_admin", "admin", "sales"]);

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ tracking_number: trackingNumber.trim() || null })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true, data: undefined };
}

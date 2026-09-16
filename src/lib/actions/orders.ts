"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { checkoutSchema, cartLineInputSchema } from "@/lib/validation/checkout-schema";
import { siteConfig } from "@/lib/content/site-config";
import { getOrderByNumberAndEmail } from "@/lib/data/orders";
import { requireRole } from "@/lib/auth/require-role";
import { sendOrderConfirmationEmail } from "@/lib/email/send-order-confirmation";
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
  // profile. A brand-new email gets an account created directly (not via
  // inviteUserByEmail, which depends on Supabase's own — heavily rate
  // limited — mailer to even create the user; createUser never sends mail,
  // so account creation itself can't be blocked by mail delivery), AND the
  // current browser is logged into it immediately via a magic-link OTP, so
  // they land on the confirmation page already signed in. The order
  // confirmation email (sent further down) carries a "set your password"
  // link for signing in on other devices.
  //
  // An email that ALREADY has an account is only linked silently — we never
  // log the current browser into an existing account just because someone
  // typed that email at checkout, since that would let anyone hijack a
  // stranger's account by "ordering" with their address. They instead get a
  // "sign in to view this order" link in their own inbox.
  let profileId = user?.id ?? null;
  let setPasswordUrl: string | undefined;
  let signInUrl: string | undefined;

  if (!profileId) {
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: values.email,
      email_confirm: true,
      user_metadata: { full_name: values.fullName },
    });

    if (!createError && created.user) {
      profileId = created.user.id;

      const { data: loginLink } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email: values.email,
      });
      const loginHashedToken = loginLink?.properties?.hashed_token;
      if (loginHashedToken) {
        await supabase.auth.verifyOtp({ token_hash: loginHashedToken, type: "magiclink" });
      }

      const { data: passwordLink } = await admin.auth.admin.generateLink({
        type: "recovery",
        email: values.email,
      });
      const passwordHashedToken = passwordLink?.properties?.hashed_token;
      if (passwordHashedToken) {
        setPasswordUrl = `${siteConfig.url}/auth/confirm?token_hash=${passwordHashedToken}&type=recovery&next=/account/set-password`;
      }
    } else {
      const { data: existing } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email: values.email,
      });
      profileId = existing?.user?.id ?? null;
      const signInHashedToken = existing?.properties?.hashed_token;
      if (signInHashedToken) {
        signInUrl = `${siteConfig.url}/auth/confirm?token_hash=${signInHashedToken}&type=magiclink&next=/account/orders`;
      }
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

  try {
    await sendOrderConfirmationEmail(values.email, {
      contactName: values.fullName,
      orderNumber,
      items: lines.map((line) => ({
        product_name: line.productName,
        variant_label: line.variantLabel,
        quantity: line.quantity,
        line_total: line.unitPrice * line.quantity,
      })),
      subtotal,
      shippingFee: 0,
      total: subtotal,
      paymentMethod: values.paymentMethod,
      setPasswordUrl,
      signInUrl,
    });
  } catch (emailError) {
    console.error("[email] Order confirmation send threw", emailError);
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

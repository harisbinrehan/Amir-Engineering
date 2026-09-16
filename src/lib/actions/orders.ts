"use server";

import { createClient } from "@/lib/supabase/server";
import { checkoutSchema, cartLineInputSchema } from "@/lib/validation/checkout-schema";
import { z } from "zod";

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

  const { data: orderNumber, error: numberError } = await supabase.rpc("generate_order_number");
  if (numberError || !orderNumber) {
    return { success: false, error: "Could not generate an order number. Please try again." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  // Insert without .select() — a guest submitter has no SELECT policy on
  // `orders`, and Postgres raises an RLS error on INSERT ... RETURNING when
  // the new row isn't visible back to the caller. Generating the id
  // ourselves avoids needing it returned at all.
  const orderId = crypto.randomUUID();

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    order_number: orderNumber,
    profile_id: user?.id ?? null,
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

  const { error: itemsError } = await supabase.from("order_items").insert(
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

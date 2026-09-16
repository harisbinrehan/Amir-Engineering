import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { OrderPaymentStatusSelect } from "@/components/admin/order-payment-status-select";
import { OrderTrackingForm } from "@/components/admin/order-tracking-form";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminOrderById } from "@/lib/data/orders";

export const metadata: Metadata = { title: "Order Detail" };

export default async function AdminOrderDetailPage(props: PageProps<"/admin/orders/[id]">) {
  await requireRole(["super_admin", "admin", "sales"]);

  const { id } = await props.params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-muted-foreground text-sm">Order</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight">{order.order_number}</h1>
          <p className="text-muted-foreground mt-1 text-sm">Placed {formatDateTime(order.created_at)}</p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer &amp; Shipping</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={order.contact_name} />
              <Field label="Phone" value={order.contact_phone} />
              <Field label="Email" value={order.contact_email} />
              <Field
                label="Payment Method"
                value={order.payment_method === "cod" ? "Cash on Delivery" : "Bank Transfer"}
              />
              <Field
                label="Address"
                value={[order.shipping_address_line1, order.shipping_address_line2].filter(Boolean).join(", ")}
                className="sm:col-span-2"
              />
              <Field
                label="City / Province / Postal Code"
                value={[order.shipping_city, order.shipping_province, order.shipping_postal_code]
                  .filter(Boolean)
                  .join(", ")}
                className="sm:col-span-2"
              />
              {order.notes && <Field label="Order Notes" value={order.notes} className="sm:col-span-2" />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-border divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      {item.variant_label && <p className="text-muted-foreground text-xs">{item.variant_label}</p>}
                      <p className="text-muted-foreground text-xs">Qty {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.line_total)}</p>
                  </div>
                ))}
              </div>
              <div className="border-border mt-3 flex items-center justify-between border-t pt-3 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatCurrency(order.shipping_fee)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderPaymentStatusSelect orderId={order.id} paymentStatus={order.payment_status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tracking Number</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTrackingForm orderId={order.id} trackingNumber={order.tracking_number} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-muted-foreground text-xs tracking-wide uppercase">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

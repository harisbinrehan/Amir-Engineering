import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { getOrderByNumber } from "@/lib/data/orders";
import { formatPkr } from "@/lib/utils/currency";

export const metadata: Metadata = { title: "Order Placed" };

export default async function OrderConfirmationPage(props: PageProps<"/order-confirmation/[orderNumber]">) {
  const { orderNumber } = await props.params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <Section containerClassName="max-w-xl text-center">
      <CheckCircle2Icon className="text-food mx-auto size-14" strokeWidth={1.5} />
      <h1 className="font-heading mt-6 text-3xl font-bold tracking-tight">Order Placed</h1>
      <p className="text-muted-foreground mt-4 text-lg">
        Thank you, {order.contact_name}. We've received your order and will be in touch to confirm delivery.
      </p>

      <div className="bg-secondary/60 mt-8 rounded-lg px-6 py-4">
        <p className="text-muted-foreground text-sm">Your order number</p>
        <p className="font-heading mt-1 text-2xl font-bold tracking-wide">{order.order_number}</p>
      </div>

      <div className="border-border mt-8 rounded-lg border text-left">
        <div className="divide-border divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 p-4 text-sm">
              <div>
                <p className="font-medium">{item.product_name}</p>
                {item.variant_label && <p className="text-muted-foreground text-xs">{item.variant_label}</p>}
                <p className="text-muted-foreground text-xs">Qty {item.quantity}</p>
              </div>
              <p className="font-semibold">{formatPkr(item.line_total)}</p>
            </div>
          ))}
        </div>
        <div className="border-border flex items-center justify-between border-t p-4 text-sm font-semibold">
          <span>Total</span>
          <span>{formatPkr(order.total)}</span>
        </div>
      </div>

      <p className="text-muted-foreground mt-6 text-sm">
        Payment method: {order.payment_method === "cod" ? "Cash on Delivery" : "Bank Transfer"}
        {order.payment_method === "bank_transfer" && " — our team will share bank details shortly."}
      </p>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild className="bg-food text-food-foreground hover:bg-food/90">
          <Link href="/products">Continue Shopping</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </Section>
  );
}

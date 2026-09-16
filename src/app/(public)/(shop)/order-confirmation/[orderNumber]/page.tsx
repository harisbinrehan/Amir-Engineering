import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { getOrderByNumber } from "@/lib/data/orders";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import { formatPkr } from "@/lib/utils/currency";

export const metadata: Metadata = { title: "Order Placed" };

export default async function OrderConfirmationPage(props: PageProps<"/order-confirmation/[orderNumber]">) {
  const { orderNumber } = await props.params;
  const [order, session] = await Promise.all([getOrderByNumber(orderNumber), getCurrentProfile()]);
  if (!order) notFound();

  const isSignedIn = !!session && session.user.id === order.profile_id;

  return (
    <Section containerClassName="max-w-xl text-center">
      <CheckCircle2Icon className="text-food mx-auto size-14" strokeWidth={1.5} />
      <h1 className="font-heading mt-6 text-3xl font-bold tracking-tight">Order Placed</h1>
      <p className="text-muted-foreground mt-4 text-lg">
        Thank you, {order.contact_name}. We have received your order and will be in touch to confirm delivery.
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

      {isSignedIn ? (
        <div className="bg-secondary/60 mt-6 rounded-lg px-6 py-4 text-sm">
          You&apos;re signed in as <span className="font-medium">{order.contact_email}</span> — this order (and
          any future ones) will show up under{" "}
          <Link href="/account/orders" className="underline">
            My Orders
          </Link>
          . We also emailed you a link to set a password, for signing in on other devices.
        </div>
      ) : (
        <div className="bg-secondary/60 mt-6 rounded-lg px-6 py-4 text-sm">
          We&apos;ve set up an account for <span className="font-medium">{order.contact_email}</span> so you can
          track this and future orders. Check your inbox for an email to set your password — or use{" "}
          <Link href="/track-order" className="underline">
            Track Order
          </Link>{" "}
          anytime with your order number and email.
        </div>
      )}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {isSignedIn && (
          <Button asChild variant="outline">
            <Link href="/account/orders">View My Orders</Link>
          </Button>
        )}
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

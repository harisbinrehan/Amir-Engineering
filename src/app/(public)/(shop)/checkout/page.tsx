import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CheckoutForm } from "@/components/shop/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <Section containerClassName="max-w-5xl">
      <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </Section>
  );
}

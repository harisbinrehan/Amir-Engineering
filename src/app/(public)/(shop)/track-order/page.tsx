import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { TrackOrderForm } from "@/components/shop/track-order-form";

export const metadata: Metadata = { title: "Track Your Order" };

export default function TrackOrderPage() {
  return (
    <Section containerClassName="max-w-2xl">
      <Breadcrumbs items={[{ label: "Track Order" }]} />
      <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Track Your Order</h1>
      <p className="text-muted-foreground mt-3 text-lg">
        Enter your order number and the email you used at checkout to see its status.
      </p>
      <div className="mt-8">
        <TrackOrderForm />
      </div>
    </Section>
  );
}

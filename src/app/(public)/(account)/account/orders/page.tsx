import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import { getOrdersByProfileId } from "@/lib/data/orders";
import { formatPkr } from "@/lib/utils/currency";

export const metadata: Metadata = { title: "Order History" };

export default async function AccountOrdersPage() {
  const session = await getCurrentProfile();
  if (!session) redirect("/login?redirectTo=/account/orders");

  const orders = await getOrdersByProfileId(session.user.id);

  return (
    <Section containerClassName="max-w-3xl">
      <Breadcrumbs items={[{ label: "My Account", href: "/account" }, { label: "Orders" }]} />
      <h1 className="font-heading mt-4 text-2xl font-bold tracking-tight">Order History</h1>

      {orders.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={PackageIcon}
          title="No orders yet"
          description="Your food product orders will appear here once you place one."
          action={
            <Link href="/products" className="text-industrial text-sm font-medium underline">
              Shop Food Products
            </Link>
          }
        />
      ) : (
        <div className="divide-border border-border mt-8 divide-y rounded-lg border">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-heading text-sm font-semibold">{order.order_number}</p>
                <p className="text-muted-foreground text-xs">
                  {new Date(order.created_at).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="capitalize">
                  {order.status}
                </Badge>
                <span className="text-sm font-semibold">{formatPkr(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

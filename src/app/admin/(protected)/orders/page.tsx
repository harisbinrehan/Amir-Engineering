import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrdersTable } from "@/components/admin/orders-table";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminOrders, type OrderStatus } from "@/lib/data/orders";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders" };

const STATUS_FILTERS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

export default async function AdminOrdersPage(props: PageProps<"/admin/orders">) {
  await requireRole(["super_admin", "admin", "sales"]);

  const params = await props.searchParams;
  const status = (typeof params.status === "string" ? params.status : "all") as OrderStatus | "all";
  const search = typeof params.q === "string" ? params.q : "";

  const orders = await getAdminOrders({ status, search });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Food product orders placed through the website — Cash on Delivery and Bank Transfer.
        </p>
      </div>

      <form className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" method="get">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <a key={filter.value} href={`/admin/orders?status=${filter.value}${search ? `&q=${search}` : ""}`}>
              <Badge
                variant={status === filter.value ? "default" : "secondary"}
                className={cn(
                  "px-3 py-1.5 text-sm font-normal",
                  status === filter.value && "bg-industrial text-industrial-foreground",
                )}
              >
                {filter.label}
              </Badge>
            </a>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="hidden" name="status" value={status} />
          <Input name="q" placeholder="Search by order #, name, email..." defaultValue={search} className="w-64" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </div>
      </form>

      <OrdersTable orders={orders} />
    </div>
  );
}

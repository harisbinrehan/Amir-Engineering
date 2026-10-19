import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { getAdminOrders } from "@/lib/data/orders";

export function OrdersTable({ orders }: { orders: Awaited<ReturnType<typeof getAdminOrders>> }) {
  if (orders.length === 0) {
    return <EmptyState title="No orders found" description="Try adjusting your filters." />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="block rounded-lg border p-4 active:bg-muted/50"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <span className="font-medium">{order.order_number}</span>
                <p className="text-muted-foreground text-xs">
                  {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <span className="font-medium">{formatCurrency(order.total)}</span>
            </div>
            <p className="text-sm">{order.contact_name}</p>
            <p className="text-muted-foreground text-xs">{order.contact_email}</p>
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <OrderStatusBadge status={order.status} />
              <span className="text-muted-foreground text-xs">{formatDate(order.created_at)}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden rounded-lg border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                <TableCell>
                  <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                    {order.order_number}
                  </Link>
                  <div className="text-muted-foreground text-xs">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div>{order.contact_name}</div>
                    <div className="text-muted-foreground text-xs">{order.contact_email}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className="w-fit font-normal capitalize">
                      {order.payment_method === "cod" ? "Cash on Delivery" : "Bank Transfer"}
                    </Badge>
                    <span className="text-muted-foreground text-xs capitalize">{order.payment_status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

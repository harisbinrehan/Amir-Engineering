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
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Payment</TableHead>
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
                <div>{order.contact_name}</div>
                <div className="text-muted-foreground text-xs">{order.contact_email}</div>
              </TableCell>
              <TableCell>
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
  );
}

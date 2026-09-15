import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Enums } from "@/types/database.types";

type QuoteStatus = Enums<"quote_status">;
type OrderStatus = Enums<"order_status">;

const quoteStatusStyles: Record<QuoteStatus, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  reviewing: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  contacted: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  quotation_sent: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300",
  negotiation: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300",
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  completed: "bg-neutral-200 text-neutral-800 dark:bg-neutral-500/20 dark:text-neutral-300",
};

const orderStatusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  processing: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  shipped: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  refunded: "bg-neutral-200 text-neutral-800 dark:bg-neutral-500/20 dark:text-neutral-300",
};

function labelize(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <Badge variant="outline" className={cn("border-transparent font-medium", quoteStatusStyles[status])}>
      {labelize(status)}
    </Badge>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={cn("border-transparent font-medium", orderStatusStyles[status])}>
      {labelize(status)}
    </Badge>
  );
}

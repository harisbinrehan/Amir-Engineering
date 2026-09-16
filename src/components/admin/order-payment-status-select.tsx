"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateOrderPaymentStatus } from "@/lib/actions/orders";
import type { Enums } from "@/types/database.types";

const STATUSES: Enums<"payment_status">[] = ["unpaid", "paid", "refunded"];

export function OrderPaymentStatusSelect({
  orderId,
  paymentStatus,
}: {
  orderId: string;
  paymentStatus: Enums<"payment_status">;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={paymentStatus}
      disabled={isPending}
      onValueChange={(value) =>
        startTransition(async () => {
          const result = await updateOrderPaymentStatus(orderId, value as Enums<"payment_status">);
          if (!result.success) toast.error(result.error);
          else toast.success("Payment status updated");
        })
      }
    >
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="capitalize">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

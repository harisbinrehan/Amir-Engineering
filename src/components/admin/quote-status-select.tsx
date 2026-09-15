"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateQuoteStatus } from "@/lib/actions/quotes";
import type { Enums } from "@/types/database.types";

const STATUSES: Enums<"quote_status">[] = [
  "new",
  "reviewing",
  "contacted",
  "quotation_sent",
  "negotiation",
  "approved",
  "rejected",
  "completed",
];

export function QuoteStatusSelect({ quoteId, status }: { quoteId: string; status: Enums<"quote_status"> }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={isPending}
      onValueChange={(value) =>
        startTransition(async () => {
          const result = await updateQuoteStatus(quoteId, value as Enums<"quote_status">);
          if (!result.success) toast.error(result.error);
          else toast.success("Status updated");
        })
      }
    >
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="capitalize">
            {s.replace(/_/g, " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

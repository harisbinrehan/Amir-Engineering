"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { assignQuote } from "@/lib/actions/quotes";

export function QuoteAssignSelect({
  quoteId,
  assignedTo,
  staff,
}: {
  quoteId: string;
  assignedTo: string | null;
  staff: { id: string; full_name: string | null }[];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={assignedTo ?? "unassigned"}
      disabled={isPending}
      onValueChange={(value) =>
        startTransition(async () => {
          const result = await assignQuote(quoteId, value === "unassigned" ? null : value);
          if (!result.success) toast.error(result.error);
          else toast.success("Assignment updated");
        })
      }
    >
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">Unassigned</SelectItem>
        {staff.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.full_name ?? "Unnamed staff"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

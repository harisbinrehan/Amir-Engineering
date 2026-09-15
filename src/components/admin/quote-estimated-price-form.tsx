"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setQuoteEstimatedPrice } from "@/lib/actions/quotes";

export function QuoteEstimatedPriceForm({
  quoteId,
  estimatedPrice,
}: {
  quoteId: string;
  estimatedPrice: number | null;
}) {
  const [value, setValue] = useState(estimatedPrice?.toString() ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex gap-2"
      action={() =>
        startTransition(async () => {
          const parsed = value.trim() === "" ? null : Number(value);
          const result = await setQuoteEstimatedPrice(quoteId, Number.isNaN(parsed) ? null : parsed);
          if (!result.success) toast.error(result.error);
          else toast.success("Estimated price saved");
        })
      }
    >
      <Input
        type="number"
        min={0}
        step="0.01"
        placeholder="e.g. 1500000"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-40"
      />
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        Save
      </Button>
    </form>
  );
}

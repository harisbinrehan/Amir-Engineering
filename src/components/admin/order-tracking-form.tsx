"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateOrderTracking } from "@/lib/actions/orders";

export function OrderTrackingForm({ orderId, trackingNumber }: { orderId: string; trackingNumber: string | null }) {
  const [value, setValue] = useState(trackingNumber ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex gap-2"
      action={() =>
        startTransition(async () => {
          const result = await updateOrderTracking(orderId, value);
          if (!result.success) toast.error(result.error);
          else toast.success("Tracking number saved");
        })
      }
    >
      <Input
        placeholder="e.g. TCS-123456789"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        Save
      </Button>
    </form>
  );
}

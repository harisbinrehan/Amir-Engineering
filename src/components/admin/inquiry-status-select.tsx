"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateContactInquiryStatus } from "@/lib/actions/contact";
import type { Enums } from "@/types/database.types";

const STATUSES: Enums<"contact_inquiry_status">[] = ["new", "read", "resolved"];

export function InquiryStatusSelect({
  inquiryId,
  status,
}: {
  inquiryId: string;
  status: Enums<"contact_inquiry_status">;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={isPending}
      onValueChange={(value) =>
        startTransition(async () => {
          const result = await updateContactInquiryStatus(inquiryId, value as Enums<"contact_inquiry_status">);
          if (!result.success) toast.error(result.error);
          else {
            toast.success("Status updated");
            router.refresh();
          }
        })
      }
    >
      <SelectTrigger className="w-32">
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

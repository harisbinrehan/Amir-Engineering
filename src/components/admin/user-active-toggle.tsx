"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { setUserActive } from "@/lib/actions/users";

export function UserActiveToggle({
  userId,
  isActive,
  disabled,
}: {
  userId: string;
  isActive: boolean;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      checked={isActive}
      disabled={disabled || isPending}
      onCheckedChange={(value) =>
        startTransition(async () => {
          const result = await setUserActive(userId, value);
          if (!result.success) toast.error(result.error);
          else {
            toast.success(value ? "Account activated" : "Account deactivated");
            router.refresh();
          }
        })
      }
    />
  );
}

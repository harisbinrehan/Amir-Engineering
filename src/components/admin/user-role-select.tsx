"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserRole } from "@/lib/actions/users";
import type { Enums } from "@/types/database.types";

const ROLES: Enums<"app_role">[] = ["super_admin", "admin", "finance", "sales", "content_manager", "customer"];

export function UserRoleSelect({ userId, role, disabled }: { userId: string; role: Enums<"app_role">; disabled?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={role}
      disabled={disabled || isPending}
      onValueChange={(value) =>
        startTransition(async () => {
          const result = await updateUserRole(userId, value as Enums<"app_role">);
          if (!result.success) toast.error(result.error);
          else {
            toast.success("Role updated");
            router.refresh();
          }
        })
      }
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r} value={r} className="capitalize">
            {r.replace(/_/g, " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

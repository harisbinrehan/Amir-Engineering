import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { SpecificationFormDialog } from "@/components/admin/specification-form-dialog";
import { DeleteSpecificationButton } from "@/components/admin/delete-specification-button";
import { PencilIcon } from "lucide-react";
import type { getAdminMachineryById } from "@/lib/data/admin-machinery";

export function SpecificationsTable({
  machineryId,
  specifications,
}: {
  machineryId: string;
  specifications: NonNullable<Awaited<ReturnType<typeof getAdminMachineryById>>>["specifications"];
}) {
  if (specifications.length === 0) {
    return <EmptyState title="No specifications yet" description="Add a spec to show on the machine's page." />;
  }

  return (
    <div className="space-y-3">
      {specifications.map((spec) => (
        <div key={spec.id} className="rounded-lg border p-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold">{spec.label}</span>
            {spec.spec_group && (
              <span className="text-muted-foreground shrink-0 text-xs">{spec.spec_group}</span>
            )}
          </div>

          <p className="text-sm">{spec.value}</p>

          <div className="flex items-center gap-1 border-t pt-3 mt-3">
            <SpecificationFormDialog
              machineryId={machineryId}
              specification={spec}
              trigger={
                <Button type="button" variant="ghost" size="sm" className="gap-1.5">
                  <PencilIcon className="size-3.5" />
                  Edit
                </Button>
              }
            />
            <DeleteSpecificationButton specId={spec.id} machineryId={machineryId} />
          </div>
        </div>
      ))}
    </div>
  );
}

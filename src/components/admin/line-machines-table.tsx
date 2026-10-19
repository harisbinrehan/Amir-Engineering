import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { LineMachineFormDialog } from "@/components/admin/line-machine-form-dialog";
import { DeleteLineMachineButton } from "@/components/admin/delete-line-machine-button";
import { PencilIcon } from "lucide-react";
import type { getAdminProductionLineById, getAdminMachineryOptions } from "@/lib/data/admin-production-lines";

export function LineMachinesTable({
  lineId,
  machines,
  stages,
  machineryOptions,
}: {
  lineId: string;
  machines: NonNullable<Awaited<ReturnType<typeof getAdminProductionLineById>>>["machines"];
  stages: NonNullable<Awaited<ReturnType<typeof getAdminProductionLineById>>>["stages"];
  machineryOptions: Awaited<ReturnType<typeof getAdminMachineryOptions>>;
}) {
  if (machines.length === 0) {
    return <EmptyState title="No machines yet" description="Add the machines included in this production line." />;
  }

  return (
    <div className="space-y-3">
      {machines.map((entry) => (
        <div key={entry.id} className="rounded-lg border p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 truncate font-medium">{entry.machinery?.name ?? "—"}</p>
            <span className="text-muted-foreground shrink-0 text-sm">Qty {entry.quantity}</span>
          </div>
          {entry.stage && (
            <Badge variant="secondary" className="mt-2 font-normal">
              {entry.stage.name}
            </Badge>
          )}
          <div className="mt-3 flex items-center gap-1 border-t pt-3">
            <LineMachineFormDialog
              lineId={lineId}
              stages={stages}
              machineryOptions={machineryOptions}
              entry={entry}
              trigger={
                <Button type="button" variant="ghost" size="sm" className="gap-1.5">
                  <PencilIcon className="size-3.5" />
                  Edit
                </Button>
              }
            />
            <DeleteLineMachineButton entryId={entry.id} lineId={lineId} />
          </div>
        </div>
      ))}
    </div>
  );
}

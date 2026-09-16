import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Machine</TableHead>
            <TableHead className="hidden sm:table-cell">Stage</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {machines.map((entry) => (
            <TableRow key={entry.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{entry.machinery?.name ?? "—"}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {entry.stage ? (
                  <Badge variant="secondary" className="font-normal">
                    {entry.stage.name}
                  </Badge>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="text-right">{entry.quantity}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <LineMachineFormDialog
                    lineId={lineId}
                    stages={stages}
                    machineryOptions={machineryOptions}
                    entry={entry}
                    trigger={
                      <Button type="button" variant="ghost" size="icon">
                        <PencilIcon className="size-4" />
                      </Button>
                    }
                  />
                  <DeleteLineMachineButton entryId={entry.id} lineId={lineId} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

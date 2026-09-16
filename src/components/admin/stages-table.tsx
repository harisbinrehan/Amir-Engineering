import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { StageFormDialog } from "@/components/admin/stage-form-dialog";
import { DeleteStageButton } from "@/components/admin/delete-stage-button";
import { PencilIcon } from "lucide-react";
import type { getAdminProductionLineById } from "@/lib/data/admin-production-lines";

export function StagesTable({
  lineId,
  stages,
}: {
  lineId: string;
  stages: NonNullable<Awaited<ReturnType<typeof getAdminProductionLineById>>>["stages"];
}) {
  if (stages.length === 0) {
    return <EmptyState title="No stages yet" description="Add stages like Mixing, Extrusion, Drying." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Description</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {stages.map((stage) => (
            <TableRow key={stage.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{stage.name}</TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {stage.description ?? "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <StageFormDialog
                    lineId={lineId}
                    stage={stage}
                    trigger={
                      <Button type="button" variant="ghost" size="icon">
                        <PencilIcon className="size-4" />
                      </Button>
                    }
                  />
                  <DeleteStageButton stageId={stage.id} lineId={lineId} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

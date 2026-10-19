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
    <div className="space-y-3">
      {stages.map((stage) => (
        <div key={stage.id} className="rounded-lg border p-4">
          <p className="text-sm font-semibold">{stage.name}</p>

          {stage.description && (
            <p className="text-muted-foreground mt-1 text-sm">{stage.description}</p>
          )}

          <div className="flex items-center gap-1 border-t pt-3 mt-3">
            <StageFormDialog
              lineId={lineId}
              stage={stage}
              trigger={
                <Button type="button" variant="ghost" size="sm" className="gap-1.5">
                  <PencilIcon className="size-3.5" />
                  Edit
                </Button>
              }
            />
            <DeleteStageButton stageId={stage.id} lineId={lineId} />
          </div>
        </div>
      ))}
    </div>
  );
}

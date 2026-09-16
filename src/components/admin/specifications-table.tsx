import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Group</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {specifications.map((spec) => (
            <TableRow key={spec.id} className="hover:bg-muted/50">
              <TableCell className="text-muted-foreground">{spec.spec_group}</TableCell>
              <TableCell className="font-medium">{spec.label}</TableCell>
              <TableCell>{spec.value}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <SpecificationFormDialog
                    machineryId={machineryId}
                    specification={spec}
                    trigger={
                      <Button type="button" variant="ghost" size="icon">
                        <PencilIcon className="size-4" />
                      </Button>
                    }
                  />
                  <DeleteSpecificationButton specId={spec.id} machineryId={machineryId} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

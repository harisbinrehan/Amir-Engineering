import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductionLineEditForm } from "@/components/admin/production-line-edit-form";
import { StagesTable } from "@/components/admin/stages-table";
import { StageFormDialog } from "@/components/admin/stage-form-dialog";
import { LineMachinesTable } from "@/components/admin/line-machines-table";
import { LineMachineFormDialog } from "@/components/admin/line-machine-form-dialog";
import { DeleteProductionLineButton } from "@/components/admin/delete-production-line-button";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminProductionLineById, getAdminMachineryOptions } from "@/lib/data/admin-production-lines";

export const metadata: Metadata = { title: "Production Line Detail" };

export default async function AdminProductionLineDetailPage(props: PageProps<"/admin/production-lines/[id]">) {
  await requireRole(["super_admin", "admin"]);

  const { id } = await props.params;
  const [line, machineryOptions] = await Promise.all([
    getAdminProductionLineById(id),
    getAdminMachineryOptions(),
  ]);
  if (!line) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link
            href="/admin/production-lines"
            className="text-muted-foreground inline-flex items-center gap-1 text-sm hover:underline"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to Production Lines
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">{line.name}</h1>
            <Badge variant={line.is_active ? "default" : "secondary"} className="font-normal">
              {line.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <DeleteProductionLineButton lineId={line.id} />
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <ProductionLineEditForm line={line} />
        </div>

        <div className="min-w-0 space-y-6">
          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Stages</CardTitle>
              <StageFormDialog lineId={line.id} />
            </CardHeader>
            <CardContent className="min-w-0 p-4 sm:p-6">
              <StagesTable lineId={line.id} stages={line.stages} />
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Included Machines</CardTitle>
              <LineMachineFormDialog lineId={line.id} stages={line.stages} machineryOptions={machineryOptions} />
            </CardHeader>
            <CardContent className="min-w-0 p-4 sm:p-6">
              <LineMachinesTable
                lineId={line.id}
                machines={line.machines}
                stages={line.stages}
                machineryOptions={machineryOptions}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

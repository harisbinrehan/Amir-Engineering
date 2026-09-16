import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MachineryEditForm } from "@/components/admin/machinery-edit-form";
import { SpecificationsTable } from "@/components/admin/specifications-table";
import { SpecificationFormDialog } from "@/components/admin/specification-form-dialog";
import { DeleteMachineryButton } from "@/components/admin/delete-machinery-button";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminMachineryById, getAdminMachineryCategories } from "@/lib/data/admin-machinery";

export const metadata: Metadata = { title: "Machine Detail" };

export default async function AdminMachineryDetailPage(props: PageProps<"/admin/machinery/[id]">) {
  await requireRole(["super_admin", "admin"]);

  const { id } = await props.params;
  const [machinery, categories] = await Promise.all([getAdminMachineryById(id), getAdminMachineryCategories()]);
  if (!machinery) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link
            href="/admin/machinery"
            className="text-muted-foreground inline-flex items-center gap-1 text-sm hover:underline"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to Machinery
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">{machinery.name}</h1>
            <Badge variant={machinery.is_active ? "default" : "secondary"} className="font-normal">
              {machinery.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <DeleteMachineryButton machineryId={machinery.id} />
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <MachineryEditForm machinery={machinery} categories={categories} />
        </div>

        <div className="min-w-0 space-y-6">
          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Specifications</CardTitle>
              <SpecificationFormDialog machineryId={machinery.id} />
            </CardHeader>
            <CardContent className="min-w-0 p-4 sm:p-6">
              <SpecificationsTable machineryId={machinery.id} specifications={machinery.specifications} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

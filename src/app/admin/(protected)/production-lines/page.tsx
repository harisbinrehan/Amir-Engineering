import type { Metadata } from "next";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductionLinesTable } from "@/components/admin/production-lines-table";
import { ProductionLineFormDialog } from "@/components/admin/production-line-form-dialog";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminProductionLines } from "@/lib/data/admin-production-lines";

export const metadata: Metadata = { title: "Production Lines" };

async function ProductionLinesList({ search }: { search: string }) {
  const lines = await getAdminProductionLines({ search });
  return <ProductionLinesTable lines={lines} />;
}

export default async function AdminProductionLinesPage(props: PageProps<"/admin/production-lines">) {
  await requireRole(["super_admin", "admin"]);

  const params = await props.searchParams;
  const search = typeof params.q === "string" ? params.q : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Production Lines</h1>
          <p className="text-muted-foreground mt-1 text-sm">Complete turnkey lines, stages and included machines.</p>
        </div>
        <ProductionLineFormDialog />
      </div>

      <form className="flex justify-end" method="get">
        <div className="flex gap-2">
          <Input name="q" placeholder="Search production lines..." defaultValue={search} className="w-64" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </div>
      </form>

      <Suspense key={search} fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <ProductionLinesList search={search} />
      </Suspense>
    </div>
  );
}

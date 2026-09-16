import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PackageIcon, AlertTriangleIcon, XCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/admin/stat-card";
import { InventoryTable } from "@/components/admin/inventory-table";
import { requireRole } from "@/lib/auth/require-role";
import { getInventoryVariants, getInventorySummary } from "@/lib/data/admin-inventory";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Inventory" };

async function InventoryList({ filter, search }: { filter: string; search: string }) {
  const variants = await getInventoryVariants({ lowStockOnly: filter === "low", search });
  return <InventoryTable variants={variants} />;
}

export default async function AdminInventoryPage(props: PageProps<"/admin/inventory">) {
  await requireRole(["super_admin", "admin"]);

  const params = await props.searchParams;
  const filter = typeof params.filter === "string" ? params.filter : "all";
  const search = typeof params.q === "string" ? params.q : "";

  const summary = await getInventorySummary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground mt-1 text-sm">Stock levels across all product variants.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Units in Stock" value={summary.totalUnits} icon={PackageIcon} />
        <StatCard label="Low Stock Variants" value={summary.lowStockCount} icon={AlertTriangleIcon} />
        <StatCard label="Out of Stock" value={summary.outOfStockCount} icon={XCircleIcon} />
      </div>

      <form className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" method="get">
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/inventory?filter=all${search ? `&q=${search}` : ""}`} scroll={false}>
            <Badge
              variant={filter === "all" ? "default" : "secondary"}
              className={cn("px-3 py-1.5 text-sm font-normal transition-colors hover:bg-industrial hover:text-industrial-foreground", filter === "all" && "bg-industrial text-industrial-foreground")}
            >
              All Variants
            </Badge>
          </Link>
          <Link href={`/admin/inventory?filter=low${search ? `&q=${search}` : ""}`} scroll={false}>
            <Badge
              variant={filter === "low" ? "default" : "secondary"}
              className={cn("px-3 py-1.5 text-sm font-normal transition-colors hover:bg-industrial hover:text-industrial-foreground", filter === "low" && "bg-industrial text-industrial-foreground")}
            >
              Low Stock Only
            </Badge>
          </Link>
        </div>
        <div className="flex gap-2">
          <input type="hidden" name="filter" value={filter} />
          <Input name="q" placeholder="Search by SKU or product..." defaultValue={search} className="w-64" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </div>
      </form>

      <Suspense key={filter + search} fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <InventoryList filter={filter} search={search} />
      </Suspense>
    </div>
  );
}

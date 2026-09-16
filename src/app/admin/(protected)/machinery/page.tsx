import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MachineryTable } from "@/components/admin/machinery-table";
import { MachineryFormDialog } from "@/components/admin/machinery-form-dialog";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminMachineryList, getAdminMachineryCategories } from "@/lib/data/admin-machinery";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Machinery" };

async function MachineryList({ categoryId, search }: { categoryId: string; search: string }) {
  const machinery = await getAdminMachineryList({ categoryId: categoryId === "all" ? undefined : categoryId, search });
  return <MachineryTable machinery={machinery} />;
}

export default async function AdminMachineryPage(props: PageProps<"/admin/machinery">) {
  await requireRole(["super_admin", "admin"]);

  const params = await props.searchParams;
  const categoryId = typeof params.category === "string" ? params.category : "all";
  const search = typeof params.q === "string" ? params.q : "";

  const categories = await getAdminMachineryCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Machinery</h1>
          <p className="text-muted-foreground mt-1 text-sm">Industrial machines, specifications and pricing.</p>
        </div>
        <MachineryFormDialog categories={categories} />
      </div>

      <form className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" method="get">
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/machinery?category=all${search ? `&q=${search}` : ""}`} scroll={false}>
            <Badge
              variant={categoryId === "all" ? "default" : "secondary"}
              className={cn(
                "px-3 py-1.5 text-sm font-normal transition-colors hover:bg-industrial hover:text-industrial-foreground",
                categoryId === "all" && "bg-industrial text-industrial-foreground",
              )}
            >
              All
            </Badge>
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/admin/machinery?category=${c.id}${search ? `&q=${search}` : ""}`} scroll={false}>
              <Badge
                variant={categoryId === c.id ? "default" : "secondary"}
                className={cn(
                  "px-3 py-1.5 text-sm font-normal transition-colors hover:bg-industrial hover:text-industrial-foreground",
                  categoryId === c.id && "bg-industrial text-industrial-foreground",
                )}
              >
                {c.name}
              </Badge>
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="hidden" name="category" value={categoryId} />
          <Input name="q" placeholder="Search machinery..." defaultValue={search} className="w-64" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </div>
      </form>

      <Suspense key={categoryId + search} fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <MachineryList categoryId={categoryId} search={search} />
      </Suspense>
    </div>
  );
}

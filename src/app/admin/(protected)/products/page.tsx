import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogTable } from "@/components/admin/catalog/catalog-table";
import { CatalogFilters } from "@/components/admin/catalog/catalog-filters";
import { CatalogPagination } from "@/components/admin/catalog/catalog-pagination";
import { ExportCsvButton, ImportCsvDialog } from "@/components/admin/catalog/catalog-import-export";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminProductCategories } from "@/lib/data/admin-products";
import {
  getCatalogProducts,
  type CatalogSortField,
  type CatalogSortDir,
  type StatusFilter,
  type StockFilter,
} from "@/lib/data/admin-catalog";

export const metadata: Metadata = { title: "Products" };

async function CatalogList({
  search,
  categoryId,
  status,
  stock,
  sort,
  dir,
  page,
  categories,
}: {
  search: string;
  categoryId: string;
  status: StatusFilter;
  stock: StockFilter;
  sort: CatalogSortField;
  dir: CatalogSortDir;
  page: number;
  categories: Awaited<ReturnType<typeof getAdminProductCategories>>;
}) {
  const result = await getCatalogProducts({
    search: search || undefined,
    categoryId: categoryId || undefined,
    status,
    stock,
    sort,
    dir,
    page,
    pageSize: 25,
  });

  return (
    <>
      <CatalogTable rows={result.rows} categories={categories} />
      <CatalogPagination page={result.page} pageCount={result.pageCount} total={result.total} />
    </>
  );
}

export default async function AdminProductsPage(props: PageProps<"/admin/products">) {
  await requireRole(["super_admin", "admin"]);

  const params = await props.searchParams;
  const search = typeof params.q === "string" ? params.q : "";
  const categoryId = typeof params.category === "string" ? params.category : "";
  const status = (typeof params.status === "string" ? params.status : "all") as StatusFilter;
  const stock = (typeof params.stock === "string" ? params.stock : "all") as StockFilter;
  const sort = (typeof params.sort === "string" ? params.sort : "name") as CatalogSortField;
  const dir = (typeof params.dir === "string" ? params.dir : "asc") as CatalogSortDir;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;

  const categories = await getAdminProductCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1 text-sm">Food products, pricing, variants and inventory.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportCsvButton />
          <ImportCsvDialog />
          <ProductFormDialog categories={categories} />
        </div>
      </div>

      <CatalogFilters categories={categories} />

      <Suspense
        key={`${search}:${categoryId}:${status}:${stock}:${sort}:${dir}:${page}`}
        fallback={<Skeleton className="h-[500px] w-full rounded-lg" />}
      >
        <CatalogList
          search={search}
          categoryId={categoryId}
          status={status}
          stock={stock}
          sort={sort}
          dir={dir}
          page={page}
          categories={categories}
        />
      </Suspense>
    </div>
  );
}

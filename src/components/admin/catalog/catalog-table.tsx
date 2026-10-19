"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageIcon, PencilIcon, SlidersHorizontalIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { CATALOG_COLUMNS, loadColumnPrefs, saveColumnPrefs, type CatalogColumnKey } from "./catalog-columns";
import { CatalogBulkToolbar } from "./catalog-bulk-toolbar";
import type { getCatalogProducts } from "@/lib/data/admin-catalog";
import type { getAdminProductCategories } from "@/lib/data/admin-products";

type CatalogRow = Awaited<ReturnType<typeof getCatalogProducts>>["rows"][number];

const STOCK_BADGE: Record<string, { label: string; className: string }> = {
  in_stock: { label: "In Stock", className: "bg-food text-food-foreground" },
  low_stock: { label: "Low Stock", className: "bg-industrial text-industrial-foreground" },
  out_of_stock: { label: "Out of Stock", className: "" },
  no_variants: { label: "No Variants", className: "" },
};

export function CatalogTable({
  rows,
  categories,
}: {
  rows: CatalogRow[];
  categories: Awaited<ReturnType<typeof getAdminProductCategories>>;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState<Record<CatalogColumnKey, boolean>>(() =>
    Object.fromEntries(CATALOG_COLUMNS.map((c) => [c.key, true])) as Record<CatalogColumnKey, boolean>,
  );

  // Column prefs live in localStorage — only readable once mounted on the
  // client, so this has to be an effect rather than the lazy useState
  // initializer (which runs during SSR too and would cause a hydration
  // mismatch if a stored preference differs from the server-rendered default).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColumns(loadColumnPrefs());
  }, []);

  // Selection shouldn't survive a filter/page change that may no longer
  // include the previously-selected rows — adjusted during render (React's
  // documented pattern for resetting state when a prop changes) rather than
  // in an effect, which would cause an extra render.
  const [prevRows, setPrevRows] = useState(rows);
  if (rows !== prevRows) {
    setPrevRows(rows);
    setSelected(new Set());
  }

  const toggleColumn = (key: CatalogColumnKey) => {
    setColumns((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveColumnPrefs(next);
      return next;
    });
  };

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));
  };
  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedRows = rows.filter((r) => selected.has(r.id));

  if (rows.length === 0) {
    return <EmptyState title="No products found" description="Try adjusting your filters, or add a new product." />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {selected.size > 0 ? `${selected.size} selected` : `${rows.length} product${rows.length === 1 ? "" : "s"}`}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <SlidersHorizontalIcon className="size-3.5" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {CATALOG_COLUMNS.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.key}
                checked={columns[col.key]}
                onCheckedChange={() => toggleColumn(col.key)}
                onSelect={(e) => e.preventDefault()}
              >
                {col.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedRows.length > 0 && (
        <CatalogBulkToolbar
          selectedIds={selectedRows.map((r) => r.id)}
          selectedRows={selectedRows.map((r) => ({ id: r.id, name: r.name }))}
          categories={categories}
          onDone={() => setSelected(new Set())}
        />
      )}

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
              </TableHead>
              <TableHead>Product</TableHead>
              {columns.category && <TableHead className="hidden md:table-cell">Category</TableHead>}
              {columns.price && <TableHead className="text-right">Price</TableHead>}
              {columns.stock && <TableHead className="hidden text-right sm:table-cell">Stock</TableHead>}
              {columns.status && <TableHead>Status</TableHead>}
              {columns.updated && <TableHead className="hidden lg:table-cell">Updated</TableHead>}
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const stockInfo = STOCK_BADGE[row.stock_status ?? "no_variants"];
              const priceLabel =
                row.price_from === row.price_to
                  ? formatCurrency(Number(row.price_from))
                  : `${formatCurrency(Number(row.price_from))}–${formatCurrency(Number(row.price_to))}`;

              return (
                <TableRow key={row.id} className="hover:bg-muted/50" data-state={selected.has(row.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selected.has(row.id)}
                      onCheckedChange={() => toggleOne(row.id)}
                      aria-label={`Select ${row.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded-md">
                        {row.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={row.image_url} alt="" className="size-full object-cover" />
                        ) : (
                          <div className="text-muted-foreground flex size-full items-center justify-center">
                            <ImageIcon className="size-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {row.name}
                          {row.is_featured && (
                            <Badge variant="secondary" className="ml-2 font-normal">
                              Featured
                            </Badge>
                          )}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {row.variant_count} variant{row.variant_count === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  {columns.category && (
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {row.category_name ?? "—"}
                    </TableCell>
                  )}
                  {columns.price && <TableCell className="text-right font-medium">{priceLabel}</TableCell>}
                  {columns.stock && (
                    <TableCell className="hidden text-right sm:table-cell">{row.total_stock}</TableCell>
                  )}
                  {columns.status && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={row.is_active ? "default" : "secondary"} className="font-normal">
                          {row.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {row.stock_status !== "in_stock" && (
                          <Badge className={`font-normal ${stockInfo.className}`} variant={stockInfo.className ? "default" : "secondary"}>
                            {stockInfo.label}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {columns.updated && (
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {formatDate(row.updated_at)}
                    </TableCell>
                  )}
                  <TableCell>
                    <Button asChild type="button" variant="ghost" size="icon">
                      <Link href={`/admin/products/${row.id}`}>
                        <PencilIcon className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

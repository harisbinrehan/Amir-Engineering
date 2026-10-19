import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { StockAdjustDialog } from "@/components/admin/stock-adjust-dialog";
import type { getInventoryVariants } from "@/lib/data/admin-inventory";

export function InventoryTable({ variants }: { variants: Awaited<ReturnType<typeof getInventoryVariants>> }) {
  if (variants.length === 0) {
    return <EmptyState title="No variants found" description="Try adjusting your filters." />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {variants.map((variant) => {
          const isOut = variant.stock_quantity === 0;
          const isLow = !isOut && variant.stock_quantity <= variant.low_stock_threshold;

          return (
            <div key={variant.id} className="rounded-lg border p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{variant.product?.name ?? "—"}</p>
                  <p className="text-muted-foreground text-xs">{variant.sku}</p>
                </div>
                {isOut ? (
                  <Badge variant="destructive" className="shrink-0 font-normal">
                    Out of Stock
                  </Badge>
                ) : isLow ? (
                  <Badge className="bg-industrial text-industrial-foreground shrink-0 font-normal">Low Stock</Badge>
                ) : (
                  <Badge variant="secondary" className="shrink-0 font-normal">
                    In Stock
                  </Badge>
                )}
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-muted-foreground text-xs">Stock</p>
                  <p className="text-sm font-medium">{variant.stock_quantity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Low Stock At</p>
                  <p className="text-sm font-medium">{variant.low_stock_threshold}</p>
                </div>
              </div>
              <div className="mt-3 border-t pt-3">
                <StockAdjustDialog variantId={variant.id} sku={variant.sku} currentStock={variant.stock_quantity} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden rounded-lg border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="hidden md:table-cell">Variant</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="hidden text-right md:table-cell">Low Stock At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-40" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant) => {
              const isOut = variant.stock_quantity === 0;
              const isLow = !isOut && variant.stock_quantity <= variant.low_stock_threshold;

              return (
                <TableRow key={variant.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{variant.product?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{variant.sku}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {variant.label ?? "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium">{variant.stock_quantity}</TableCell>
                  <TableCell className="hidden text-right text-muted-foreground md:table-cell">
                    {variant.low_stock_threshold}
                  </TableCell>
                  <TableCell>
                    {isOut ? (
                      <Badge variant="destructive" className="font-normal">
                        Out of Stock
                      </Badge>
                    ) : isLow ? (
                      <Badge className="bg-industrial text-industrial-foreground font-normal">Low Stock</Badge>
                    ) : (
                      <Badge variant="secondary" className="font-normal">
                        In Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <StockAdjustDialog variantId={variant.id} sku={variant.sku} currentStock={variant.stock_quantity} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

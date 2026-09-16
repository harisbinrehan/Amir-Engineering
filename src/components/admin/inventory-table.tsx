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
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="hidden sm:table-cell">Variant</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="hidden text-right sm:table-cell">Low Stock At</TableHead>
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
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {variant.label ?? "—"}
                </TableCell>
                <TableCell className="text-right font-medium">{variant.stock_quantity}</TableCell>
                <TableCell className="hidden text-right text-muted-foreground sm:table-cell">
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
  );
}

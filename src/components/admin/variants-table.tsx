import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { VariantFormDialog } from "@/components/admin/variant-form-dialog";
import { DeleteVariantButton } from "@/components/admin/delete-variant-button";
import { formatCurrency } from "@/lib/utils/format";
import { PencilIcon } from "lucide-react";
import type { getAdminProductById } from "@/lib/data/admin-products";

export function VariantsTable({
  productId,
  variants,
}: {
  productId: string;
  variants: NonNullable<Awaited<ReturnType<typeof getAdminProductById>>>["variants"];
}) {
  if (variants.length === 0) {
    return <EmptyState title="No variants yet" description="Add a variant to set SKU, price and stock." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Label</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map((variant) => (
            <TableRow key={variant.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{variant.sku}</TableCell>
              <TableCell className="text-muted-foreground">{variant.label ?? "—"}</TableCell>
              <TableCell className="text-right">
                {variant.price !== null ? formatCurrency(Number(variant.price)) : "—"}
              </TableCell>
              <TableCell className="text-right">
                <span className={variant.stock_quantity <= variant.low_stock_threshold ? "text-destructive font-medium" : ""}>
                  {variant.stock_quantity}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={variant.is_active ? "default" : "secondary"} className="font-normal">
                  {variant.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <VariantFormDialog
                    productId={productId}
                    variant={variant}
                    trigger={
                      <Button type="button" variant="ghost" size="icon">
                        <PencilIcon className="size-4" />
                      </Button>
                    }
                  />
                  <DeleteVariantButton variantId={variant.id} productId={productId} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

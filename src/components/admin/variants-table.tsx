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
    <div className="space-y-3">
      {variants.map((variant) => (
        <div key={variant.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold">{variant.sku}</span>
            <Badge variant={variant.is_active ? "default" : "secondary"} className="shrink-0 font-normal">
              {variant.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>

          {variant.label && (
            <p className="text-muted-foreground mb-2 text-sm">{variant.label}</p>
          )}

          <div className="mb-3 flex gap-6">
            <div>
              <p className="text-muted-foreground text-xs">Price</p>
              <p className="text-sm font-medium">
                {variant.price !== null ? formatCurrency(Number(variant.price)) : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Stock</p>
              <p className={`text-sm font-medium ${variant.stock_quantity <= variant.low_stock_threshold ? "text-destructive" : ""}`}>
                {variant.stock_quantity}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 border-t pt-3">
            <VariantFormDialog
              productId={productId}
              variant={variant}
              trigger={
                <Button type="button" variant="ghost" size="sm" className="gap-1.5">
                  <PencilIcon className="size-3.5" />
                  Edit
                </Button>
              }
            />
            <DeleteVariantButton variantId={variant.id} productId={productId} />
          </div>
        </div>
      ))}
    </div>
  );
}

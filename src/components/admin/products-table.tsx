import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency } from "@/lib/utils/format";
import type { getAdminProducts } from "@/lib/data/admin-products";
import { PencilIcon } from "lucide-react";

export function ProductsTable({ products }: { products: Awaited<ReturnType<typeof getAdminProducts>> }) {
  if (products.length === 0) {
    return <EmptyState title="No products found" description="Try adjusting your filters, or add a new product." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead className="text-right">From Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const prices = product.variants.map((v) => v.price ?? product.base_price).filter((p) => p > 0);
            const fromPrice = prices.length > 0 ? Math.min(...prices) : product.base_price;

            return (
              <TableRow key={product.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {product.name}
                  {product.is_featured && (
                    <Badge variant="secondary" className="ml-2 font-normal">
                      Featured
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{product.category?.name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{product.variants.length}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(Number(fromPrice))}</TableCell>
                <TableCell>
                  <Badge variant={product.is_active ? "default" : "secondary"} className="font-normal">
                    {product.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button asChild type="button" variant="ghost" size="icon">
                    <Link href={`/admin/products/${product.id}`}>
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
  );
}

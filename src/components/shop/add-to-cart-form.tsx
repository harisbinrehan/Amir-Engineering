"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/lib/cart/cart-context";
import { formatPkr } from "@/lib/utils/currency";

type VariantOption = {
  id: string;
  label: string | null;
  price: number | null;
  stock_quantity: number;
};

export function AddToCartForm({
  productId,
  productSlug,
  productName,
  basePrice,
  variants,
  image,
}: {
  productId: string;
  productSlug: string;
  productName: string;
  basePrice: number;
  variants: VariantOption[];
  image?: string | null;
}) {
  const router = useRouter();
  const { addLine } = useCart();
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);

  const selected = variants.find((v) => v.id === variantId) ?? variants[0];
  const price = selected?.price ?? basePrice;
  const outOfStock = variants.length > 0 && (selected?.stock_quantity ?? 0) <= 0;

  const handleAddToCart = () => {
    if (!selected) return;
    addLine(
      {
        variantId: selected.id,
        productId,
        productSlug,
        productName,
        variantLabel: selected.label,
        unitPrice: price,
        image,
        stockQuantity: selected.stock_quantity,
      },
      quantity,
    );
    toast.success(`Added ${quantity} × ${productName} to your cart`, {
      action: { label: "View Cart", onClick: () => router.push("/cart") },
    });
  };

  return (
    <div className="mt-6 flex flex-col gap-4">
      <p className="text-food font-heading text-3xl font-bold">{formatPkr(price)}</p>

      {variants.length > 1 && (
        <div className="max-w-xs">
          <Select value={variantId} onValueChange={setVariantId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {variants.map((v) => (
                <SelectItem key={v.id} value={v.id} disabled={v.stock_quantity <= 0}>
                  {v.label ?? "Standard"} — {formatPkr(v.price ?? basePrice)}
                  {v.stock_quantity <= 0 ? " (Out of stock)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="border-border inline-flex items-center rounded-md border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <MinusIcon className="size-4" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="bg-food text-food-foreground hover:bg-food/90"
        >
          <ShoppingCartIcon />
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}

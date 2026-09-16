import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { Badge } from "@/components/ui/badge";
import { formatPkr } from "@/lib/utils/currency";
import { realProductImagesBySlug } from "@/lib/content/real-product-media";

type ProductCardData = {
  slug: string;
  name: string;
  short_description: string | null;
  base_price: number;
  category: { name: string; slug: string } | null;
  variants: { price: number | null }[];
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const prices = product.variants.map((v) => v.price ?? product.base_price).filter((p) => p > 0);
  const fromPrice = prices.length > 0 ? Math.min(...prices) : product.base_price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group border-border bg-card hover:border-food/60 flex flex-col overflow-hidden rounded-lg border transition-colors"
    >
      <div className="aspect-4/3 relative overflow-hidden">
        <PlaceholderImage
          src={realProductImagesBySlug[product.slug]?.[0]}
          seed={product.slug}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {product.category && (
          <Badge variant="secondary" className="w-fit text-xs font-normal">
            {product.category.name}
          </Badge>
        )}
        <h3 className="font-heading text-base leading-snug font-semibold">{product.name}</h3>
        {product.short_description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">{product.short_description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm font-semibold">From {formatPkr(fromPrice)}</span>
          <span className="text-foreground group-hover:text-food ml-auto flex items-center gap-1 text-sm font-medium transition-colors">
            View product
            <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

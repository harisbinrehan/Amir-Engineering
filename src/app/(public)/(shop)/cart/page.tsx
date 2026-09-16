"use client";

import Link from "next/link";
import Image from "next/image";
import { MinusIcon, PlusIcon, ShoppingCartIcon, Trash2Icon, ArrowRightIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { CartSkeleton } from "@/components/shop/cart-skeleton";
import { useCart } from "@/lib/cart/cart-context";
import { formatPkr } from "@/lib/utils/currency";

export default function CartPage() {
  const { lines, subtotal, hydrated, updateQuantity, removeLine } = useCart();

  return (
    <Section containerClassName="max-w-4xl">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Your Cart</h1>

      {!hydrated ? (
        <CartSkeleton />
      ) : lines.length === 0 ? (
        <EmptyState
          className="mt-12"
          icon={ShoppingCartIcon}
          title="Your cart is empty"
          description="Browse our food products and add items to your cart."
          action={
            <Button asChild className="bg-food text-food-foreground hover:bg-food/90 mt-2">
              <Link href="/products">Shop Food Products</Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="divide-border border-border divide-y rounded-lg border lg:col-span-2">
            {lines.map((line) => (
              <div key={line.variantId} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
                <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-md sm:size-20">
                  {line.image && <Image src={line.image} alt={line.productName} fill className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1 basis-32">
                  <Link href={`/products/${line.productSlug}`} className="font-heading text-sm font-semibold hover:underline">
                    {line.productName}
                  </Link>
                  {line.variantLabel && <p className="text-muted-foreground text-xs">{line.variantLabel}</p>}
                  <p className="mt-1 text-sm font-medium">{formatPkr(line.unitPrice)}</p>
                </div>
                <div className="ml-auto flex flex-wrap items-center gap-3">
                  <div className="border-border flex items-center rounded-md border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon className="size-3.5" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{line.quantity}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <PlusIcon className="size-3.5" />
                    </Button>
                  </div>
                  <p className="shrink-0 text-right text-sm font-semibold">
                    {formatPkr(line.unitPrice * line.quantity)}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLine(line.variantId)}
                    aria-label="Remove item"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-border bg-card h-fit rounded-lg border p-6">
            <h2 className="font-heading text-lg font-bold">Order Summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPkr(subtotal)}</span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">Shipping is confirmed at checkout.</p>
            <Button asChild size="lg" className="bg-food text-food-foreground hover:bg-food/90 mt-6 w-full">
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRightIcon />
              </Link>
            </Button>
            <Button asChild variant="outline" className="mt-2 w-full">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      )}
    </Section>
  );
}

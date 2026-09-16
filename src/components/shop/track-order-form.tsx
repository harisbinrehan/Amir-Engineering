"use client";

import { useState } from "react";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { trackOrder } from "@/lib/actions/orders";
import { formatPkr } from "@/lib/utils/currency";
import type { getOrderByNumberAndEmail } from "@/lib/data/orders";

type Order = NonNullable<Awaited<ReturnType<typeof getOrderByNumberAndEmail>>>;

export function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await trackOrder({ orderNumber, email });

    if (!result.success) {
      setError(result.error);
      setOrder(null);
    } else {
      setOrder(result.data);
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="orderNumber">Order Number</FieldLabel>
              <FieldContent>
                <Input
                  id="orderNumber"
                  placeholder="ORD-2026-000123"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email Used at Checkout</FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FieldContent>
            </Field>
          </div>

          {error && <FieldError>{error}</FieldError>}

          <Button type="submit" disabled={isSubmitting} className="bg-food text-food-foreground hover:bg-food/90 w-fit">
            {isSubmitting ? <Loader2Icon className="animate-spin" /> : <SearchIcon />}
            Track Order
          </Button>
        </FieldGroup>
      </form>

      {order && (
        <div className="border-border mt-8 rounded-lg border">
          <div className="flex items-center justify-between gap-4 border-b p-5">
            <div>
              <p className="font-heading text-sm font-semibold">{order.order_number}</p>
              <p className="text-muted-foreground text-xs">
                Placed{" "}
                {new Date(order.created_at).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge variant="secondary" className="capitalize">
              {order.status}
            </Badge>
          </div>
          <div className="divide-border divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 p-4 text-sm">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  {item.variant_label && <p className="text-muted-foreground text-xs">{item.variant_label}</p>}
                  <p className="text-muted-foreground text-xs">Qty {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatPkr(item.line_total)}</p>
              </div>
            ))}
          </div>
          <div className="border-border flex items-center justify-between border-t p-4 text-sm font-semibold">
            <span>Total</span>
            <span>{formatPkr(order.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

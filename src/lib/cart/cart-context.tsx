"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  variantLabel: string | null;
  unitPrice: number;
  quantity: number;
  image?: string | null;
  stockQuantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addLine: (line: Omit<CartLine, "quantity">, quantity: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "amir-engineering-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // Ignore unreadable/corrupt cart state — start empty rather than crash.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage may be unavailable (private browsing, quota) — cart still
      // works for the current page load, it just won't persist.
    }
  }, [lines, hydrated]);

  const addLine = useCallback((line: Omit<CartLine, "quantity">, quantity: number) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === line.variantId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, existing.stockQuantity || 999);
        return prev.map((l) => (l.variantId === line.variantId ? { ...l, quantity: nextQty } : l));
      }
      return [...prev, { ...line, quantity: Math.max(1, quantity) }];
    });
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)),
    );
  }, []);

  const removeLine = useCallback((variantId: string) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0), [lines]);

  const value = useMemo(
    () => ({ lines, itemCount, subtotal, addLine, updateQuantity, removeLine, clear }),
    [lines, itemCount, subtotal, addLine, updateQuantity, removeLine, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

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
  /** False until the client has read the real cart from localStorage — use
   *  this to show a loading state instead of a premature "cart is empty". */
  hydrated: boolean;
  addLine: (line: Omit<CartLine, "quantity">, quantity: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
};

const subscribeNoop = () => () => {};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "amir-engineering-cart";

// A tiny external store backing the cart: localStorage is the source of
// truth, `cache` is a stable in-memory snapshot so useSyncExternalStore
// doesn't see a new array identity on every read (which would loop).
let cache: CartLine[] = [];
let initialized = false;
const listeners = new Set<() => void>();

function readFromStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getSnapshot(): CartLine[] {
  if (!initialized) {
    cache = readFromStorage();
    initialized = true;
  }
  return cache;
}

const emptyServerSnapshot: CartLine[] = [];

function getServerSnapshot(): CartLine[] {
  return emptyServerSnapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeLines(next: CartLine[]) {
  cache = next;
  initialized = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable (private browsing, quota) — cart still
    // works for the current page load, it just won't persist.
  }
  listeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const addLine = useCallback((line: Omit<CartLine, "quantity">, quantity: number) => {
    const current = getSnapshot();
    const existing = current.find((l) => l.variantId === line.variantId);
    if (existing) {
      const nextQty = Math.min(existing.quantity + quantity, existing.stockQuantity || 999);
      writeLines(current.map((l) => (l.variantId === line.variantId ? { ...l, quantity: nextQty } : l)));
    } else {
      writeLines([...current, { ...line, quantity: Math.max(1, quantity) }]);
    }
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    const current = getSnapshot();
    writeLines(
      quantity <= 0
        ? current.filter((l) => l.variantId !== variantId)
        : current.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)),
    );
  }, []);

  const removeLine = useCallback((variantId: string) => {
    writeLines(getSnapshot().filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => writeLines([]), []);

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0), [lines]);

  const value = useMemo(
    () => ({ lines, itemCount, subtotal, hydrated, addLine, updateQuantity, removeLine, clear }),
    [lines, itemCount, subtotal, hydrated, addLine, updateQuantity, removeLine, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

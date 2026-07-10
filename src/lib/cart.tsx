"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PRODUCTS } from "./store-data";

export type CartItem = { productId: string; qty: number };

const STORAGE_KEY = "farm-fleet.cart.v1";

type CartContextValue = {
  items: CartItem[];
  /** False during SSR and first client render — gate any cart UI on this. */
  hydrated: boolean;
  count: number;
  /** Subtotal in cents. */
  subtotal: number;
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (it): it is CartItem =>
                typeof it?.productId === "string" &&
                typeof it?.qty === "number" &&
                it.qty > 0,
            ),
          );
        }
      }
    } catch {
      // Corrupt storage — start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((productId: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.productId === productId);
      const stock =
        PRODUCTS.find((p) => p.id === productId)?.stock ?? Infinity;
      if (existing) {
        return prev.map((it) =>
          it.productId === productId
            ? { ...it, qty: Math.min(it.qty + qty, stock) }
            : it,
        );
      }
      return [...prev, { productId, qty: Math.min(qty, stock) }];
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((it) => it.productId !== productId)
        : prev.map((it) => (it.productId === productId ? { ...it, qty } : it)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const it of items) {
      const product = PRODUCTS.find((p) => p.id === it.productId);
      if (!product) continue;
      count += it.qty;
      subtotal += product.price * it.qty;
    }
    return { count, subtotal };
  }, [items]);

  const value = useMemo(
    () => ({ items, hydrated, count, subtotal, add, remove, setQty, clear }),
    [items, hydrated, count, subtotal, add, remove, setQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

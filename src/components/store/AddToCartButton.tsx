"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/store-data";

export default function AddToCartButton({
  product,
  size = "sm",
}: {
  product: Product;
  size?: "sm" | "lg";
}) {
  const { items, add } = useCart();
  const inCart = items.find((it) => it.productId === product.id)?.qty ?? 0;
  const outOfStock = product.stock === 0;
  const atMax = inCart >= product.stock;

  return (
    <button
      type="button"
      disabled={outOfStock || atMax}
      onClick={() => add(product.id)}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors ${
        size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs"
      } ${
        outOfStock || atMax
          ? "cursor-not-allowed bg-surface-2 text-ink-muted"
          : "bg-accent-green text-white hover:bg-accent-green/90"
      }`}
    >
      <ShoppingCart size={size === "lg" ? 15 : 13} />
      {outOfStock ? "Out of stock" : atMax ? "Max in cart" : "Add to cart"}
    </button>
  );
}

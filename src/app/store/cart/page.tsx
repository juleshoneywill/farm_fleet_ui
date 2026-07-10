"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import {
  CATEGORY_META,
  formatPrice,
  PRODUCTS,
} from "@/lib/store-data";
import QuantityStepper from "@/components/store/QuantityStepper";

export default function CartPage() {
  const { items, hydrated, subtotal, setQty, remove, clear } = useCart();
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <div className="rounded-xl border border-border-hairline bg-surface p-8 text-center">
          <CheckCircle2 size={40} className="mx-auto text-status-good" />
          <h1 className="mt-3 text-xl font-semibold text-ink-primary">
            Order placed
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            This is a demo storefront — no payment was taken and nothing will
            ship.
          </p>
          <Link
            href="/store"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-green hover:underline"
          >
            <ArrowLeft size={14} /> Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  const lines = items
    .map((it) => ({
      item: it,
      product: PRODUCTS.find((p) => p.id === it.productId),
    }))
    .filter(
      (l): l is { item: (typeof items)[number]; product: (typeof PRODUCTS)[number] } =>
        l.product !== undefined,
    );

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink-primary">
        Cart
      </h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Review your parts order before checkout.
      </p>

      {!hydrated ? (
        <div className="mt-6 space-y-3">
          <div className="h-20 w-full animate-pulse rounded-xl bg-surface-2" />
          <div className="h-20 w-full animate-pulse rounded-xl bg-surface-2" />
        </div>
      ) : lines.length === 0 ? (
        <div className="mt-6 rounded-xl border border-border-hairline bg-surface p-8 text-center">
          <ShoppingCart size={32} className="mx-auto text-ink-muted" />
          <p className="mt-3 text-sm font-medium text-ink-primary">
            Your cart is empty
          </p>
          <Link
            href="/store"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent-green hover:underline"
          >
            <ArrowLeft size={14} /> Browse the store
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 divide-y divide-border-hairline rounded-xl border border-border-hairline bg-surface">
            {lines.map(({ item, product }) => {
              const Icon = CATEGORY_META[product.category].icon;
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-accent-green/10 text-accent-green">
                    <Icon size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/store/${product.slug}`}
                      className="block truncate text-sm font-semibold text-ink-primary hover:underline"
                    >
                      {product.name}
                    </Link>
                    <div className="text-xs text-ink-secondary">
                      {formatPrice(product.price)} each
                    </div>
                  </div>
                  <QuantityStepper
                    qty={item.qty}
                    max={product.stock}
                    onChange={(qty) => setQty(product.id, qty)}
                  />
                  <div className="w-20 text-right text-sm font-semibold text-ink-primary tabular-nums">
                    {formatPrice(product.price * item.qty)}
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => remove(product.id)}
                    className="text-ink-muted transition-colors hover:text-status-critical"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-border-hairline bg-surface p-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Subtotal
              </div>
              <div className="text-lg font-semibold text-ink-primary">
                {formatPrice(subtotal)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                clear();
                setPlaced(true);
              }}
              className="rounded-lg bg-accent-green px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-green/90"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}

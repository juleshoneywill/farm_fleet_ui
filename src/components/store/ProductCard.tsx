"use client";

import Link from "next/link";
import {
  CATEGORY_META,
  formatPrice,
  type Product,
} from "@/lib/store-data";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  const meta = CATEGORY_META[product.category];
  const Icon = meta.icon;

  return (
    <div className="flex flex-col rounded-xl border border-border-hairline bg-surface p-4 transition-colors hover:border-accent-green/40">
      <Link href={`/store/${product.slug}`} className="group flex-1">
        <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-accent-green/10 text-accent-green">
          <Icon size={40} />
        </div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          {meta.label}
        </div>
        <div className="mt-0.5 text-sm font-semibold text-ink-primary group-hover:underline">
          {product.name}
        </div>
        <div className="mt-1 text-xs text-ink-secondary line-clamp-2">
          {product.description}
        </div>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div>
          <div className="text-base font-semibold text-ink-primary">
            {formatPrice(product.price)}
          </div>
          <div
            className={`text-[11px] ${
              product.stock === 0 ? "text-status-critical" : "text-status-good"
            }`}
          >
            {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
          </div>
        </div>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}

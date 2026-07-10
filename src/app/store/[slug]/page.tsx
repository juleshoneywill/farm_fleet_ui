"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  CATEGORY_META,
  formatPrice,
  getProduct,
} from "@/lib/store-data";
import AddToCartButton from "@/components/store/AddToCartButton";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = getProduct(slug);

  if (!product) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <div className="rounded-xl border border-status-critical/30 bg-status-critical/10 p-6">
          <p className="text-sm font-medium text-ink-primary">
            Product not found
          </p>
          <p className="mt-1 text-sm text-ink-secondary">
            No product matches “{slug}”.
          </p>
          <Link
            href="/store"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-green hover:underline"
          >
            <ArrowLeft size={14} /> Back to store
          </Link>
        </div>
      </main>
    );
  }

  const meta = CATEGORY_META[product.category];
  const Icon = meta.icon;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <Link
        href="/store"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-secondary transition-colors hover:text-ink-primary"
      >
        <ArrowLeft size={14} /> Back to store
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="flex h-64 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
          <Icon size={96} />
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            {meta.label}
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-primary">
            {product.name}
          </h1>
          <div className="mt-2 text-xl font-semibold text-ink-primary">
            {formatPrice(product.price)}
          </div>
          <div
            className={`mt-1 text-sm ${
              product.stock === 0 ? "text-status-critical" : "text-status-good"
            }`}
          >
            {product.stock === 0
              ? "Out of stock"
              : `${product.stock} in stock`}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
            {product.description}
          </p>

          {product.compatible && product.compatible.length > 0 && (
            <div className="mt-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Fits your fleet
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {product.compatible.map((serial) => (
                  <Link
                    key={serial}
                    href={`/machine/${serial}`}
                    className="rounded-lg border border-border-hairline bg-surface px-2.5 py-1 text-xs font-medium text-ink-secondary transition-colors hover:border-accent-green/40 hover:text-ink-primary"
                  >
                    {serial}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <AddToCartButton product={product} size="lg" />
          </div>
        </div>
      </div>
    </main>
  );
}

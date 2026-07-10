"use client";

import { useState } from "react";
import {
  CATEGORIES,
  CATEGORY_META,
  PRODUCTS,
  type Category,
} from "@/lib/store-data";
import ProductCard from "@/components/store/ProductCard";

export default function StorePage() {
  const [filter, setFilter] = useState<Category | "all">("all");

  const products =
    filter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === filter);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink-primary">
        Parts Store
      </h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Genuine and aftermarket tractor parts, shipped from the yard.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-1.5">
        <FilterChip
          label="All"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        {CATEGORIES.map((cat) => (
          <FilterChip
            key={cat}
            label={CATEGORY_META[cat].label}
            active={filter === cat}
            onClick={() => setFilter(cat)}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-surface-2 text-ink-primary"
          : "text-ink-secondary hover:bg-surface-2/60 hover:text-ink-primary"
      }`}
    >
      {label}
    </button>
  );
}

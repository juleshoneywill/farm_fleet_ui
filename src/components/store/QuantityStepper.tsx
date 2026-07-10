"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({
  qty,
  max,
  onChange,
}: {
  qty: number;
  max: number;
  onChange: (qty: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border-hairline">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={qty <= 1}
        onClick={() => onChange(qty - 1)}
        className="px-2 py-1.5 text-ink-secondary transition-colors hover:text-ink-primary disabled:cursor-not-allowed disabled:text-ink-muted"
      >
        <Minus size={13} />
      </button>
      <span className="min-w-7 text-center text-sm font-medium text-ink-primary tabular-nums">
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={qty >= max}
        onClick={() => onChange(qty + 1)}
        className="px-2 py-1.5 text-ink-secondary transition-colors hover:text-ink-primary disabled:cursor-not-allowed disabled:text-ink-muted"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

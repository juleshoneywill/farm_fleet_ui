"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Wheat } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function SiteHeader() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();
  const onCart = pathname === "/store/cart";

  return (
    // z-50 keeps the header above page-level overlays (e.g. the graph
    // legend) when content scrolls beneath it.
    <header className="sticky top-0 z-50 border-b border-border-hairline bg-plane/90 backdrop-blur">
      <div className="flex items-center gap-2.5 px-4 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green/15 text-accent-green">
            <Wheat size={18} strokeWidth={2} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-ink-primary">
            Farm Fleet
          </span>
        </Link>
        <span className="ml-1 hidden text-sm text-ink-muted lg:inline">
          a temporal database, browsed
        </span>
        <Link
          href="/store/cart"
          title="Cart"
          className={`relative ml-auto inline-flex items-center rounded-lg px-3 py-1.5 transition-colors ${
            onCart
              ? "bg-surface-2 text-ink-primary"
              : "text-ink-secondary hover:bg-surface-2/60 hover:text-ink-primary"
          }`}
        >
          <ShoppingCart size={17} />
          {hydrated && count > 0 && (
            <span className="absolute -top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-green px-1 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

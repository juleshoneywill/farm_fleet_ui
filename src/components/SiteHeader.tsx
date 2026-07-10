"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Network, Wheat } from "lucide-react";

// The parts graph is seeded for the demo tractor only, so the nav tab deep
// links straight to it.
const GRAPH_HREF = "/machine/JD-7230-0098/parts-graph";

export default function SiteHeader() {
  const pathname = usePathname();
  const onGraph = pathname.endsWith("/parts-graph");

  return (
    // z-50 keeps the header above page-level overlays (e.g. the graph
    // legend) when content scrolls beneath it.
    <header className="sticky top-0 z-50 border-b border-border-hairline bg-plane/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-2.5 px-6 py-4">
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
        <nav className="ml-auto flex items-center gap-1">
          <NavTab href="/" label="Fleet" icon={LayoutGrid} active={!onGraph} />
          <NavTab
            href={GRAPH_HREF}
            label="Parts graph"
            icon={Network}
            active={onGraph}
          />
        </nav>
      </div>
    </header>
  );
}

function NavTab({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-surface-2 text-ink-primary"
          : "text-ink-secondary hover:bg-surface-2/60 hover:text-ink-primary"
      }`}
    >
      <Icon size={15} />
      {label}
    </Link>
  );
}

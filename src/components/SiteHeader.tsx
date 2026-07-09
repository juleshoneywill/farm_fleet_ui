import Link from "next/link";
import { Wheat } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border-hairline bg-plane/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-2.5 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green/15 text-accent-green">
            <Wheat size={18} strokeWidth={2} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-ink-primary">
            Farm Fleet
          </span>
        </Link>
        <span className="ml-1 hidden text-sm text-ink-muted sm:inline">
          a temporal database, browsed
        </span>
      </div>
    </header>
  );
}

"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Network } from "lucide-react";
import {
  getMachine,
  getPartsGraph,
  type Machine,
  type PartsGraph,
} from "@/lib/api";
import PartsGraphView from "@/components/parts-graph/PartsGraphView";

// Full-bleed page (unlike the centered columns elsewhere): a header strip,
// then the graph canvas + cascade side panel filling the rest of the
// viewport below the sticky site header (~65px).

export default function PartsGraphPage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = use(params);
  const [machine, setMachine] = useState<Machine | null>(null);
  const [graph, setGraph] = useState<PartsGraph | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getMachine(serial), getPartsGraph(serial)])
      .then(([m, g]) => {
        setMachine(m);
        setGraph(g);
      })
      .catch((e) => setError(e.message));
  }, [serial]);

  return (
    <main className="flex h-[calc(100vh-65px)] flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border-hairline px-6 py-3">
        <Link
          href={`/machine/${encodeURIComponent(serial)}`}
          className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-accent-green"
        >
          <ArrowLeft size={15} />
          <span className="font-mono text-xs">{serial}</span>
        </Link>
        <span className="text-ink-muted">·</span>
        <h1 className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
          <Network size={15} className="text-accent-green" />
          Parts relationship graph
        </h1>
        {machine && (
          <span className="hidden text-sm text-ink-muted sm:inline">
            {machine.make} {machine.model}
          </span>
        )}
      </div>

      {error ? (
        <div className="p-6">
          <p className="rounded-xl border border-status-critical/30 bg-status-critical/10 px-4 py-3 text-sm text-ink-primary">
            Failed to load parts graph for {serial}: {error}
          </p>
        </div>
      ) : !graph ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-40 w-2/3 animate-pulse rounded-xl border border-border-hairline bg-surface" />
        </div>
      ) : graph.nodes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-sm font-medium text-ink-primary">
            No parts graph seeded for this machine yet
          </p>
          <p className="text-xs text-ink-muted">
            Try the tractor:{" "}
            <Link
              href="/machine/JD-7230-0098/parts-graph"
              className="font-medium text-accent-green hover:underline"
            >
              JD-7230-0098
            </Link>
          </p>
        </div>
      ) : (
        <PartsGraphView graph={graph} />
      )}
    </main>
  );
}

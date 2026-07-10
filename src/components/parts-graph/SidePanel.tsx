"use client";

import { X, MousePointerClick, PackageCheck, ChevronRight } from "lucide-react";
import type { PartsGraph } from "@/lib/api";
import type { Cascade } from "@/lib/cascade";
import { systemColor } from "./graphTheme";

// Lists the reorder cascade for the selected part (every part reached by the
// BFS over dependency edges, with hop distance and reasons) plus the part's
// physical assembly connections. Every listed part is clickable and becomes
// the new selection, so the graph can be navigated from the panel.

export default function SidePanel({
  graph,
  selectedId,
  cascade,
  onSelect,
  onClear,
  isDark,
}: {
  graph: PartsGraph;
  selectedId: string | null;
  cascade: Cascade | null;
  onSelect: (id: string) => void;
  onClear: () => void;
  isDark: boolean;
}) {
  const nodeOf = (id: string) => graph.nodes.find((n) => n.id === id);
  const nameOf = (id: string) => nodeOf(id)?.name ?? id;
  const selected = selectedId ? nodeOf(selectedId) : null;

  // Structural edges are undirected in feel: a neighbor is whatever sits on
  // the other end, whichever way the edge was recorded.
  const assemblyNeighbors = selectedId
    ? [
        ...new Set(
          graph.edges
            .filter(
              (e) =>
                e.type === "structural" &&
                (e.from === selectedId || e.to === selectedId),
            )
            .map((e) => (e.from === selectedId ? e.to : e.from)),
        ),
      ].sort((a, b) => nameOf(a).localeCompare(nameOf(b)))
    : [];

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-border-hairline bg-surface lg:w-96">
      {!selected || !cascade ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-ink-muted">
            <MousePointerClick size={20} />
          </span>
          <p className="text-sm font-medium text-ink-primary">
            Click a part to simulate a failure
          </p>
          <p className="text-xs leading-relaxed text-ink-muted">
            Solid gray lines show the physical assembly. Dashed amber arrows
            mean &ldquo;if this part fails, that part needs reordering
            too&rdquo; — clicking a part traces the full cascade.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-2.5 border-b border-border-hairline px-5 py-4">
            <span
              className="mt-1 h-3 w-3 shrink-0 rounded-full"
              style={{ background: systemColor(selected.system, isDark) }}
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-ink-primary">
                {selected.name}
              </h2>
              <p className="text-xs capitalize text-ink-muted">
                {selected.system} · simulated failure
              </p>
            </div>
            <button
              onClick={onClear}
              aria-label="Clear selection"
              className="rounded-lg p-1 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink-primary"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {cascade.hits.size === 0 ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-border-hairline bg-plane px-3.5 py-3">
                <PackageCheck
                  size={18}
                  className="shrink-0 text-status-good"
                />
                <p className="text-xs leading-relaxed text-ink-secondary">
                  No downstream reorder dependencies — replacing this part
                  alone is enough.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Also reorder ({cascade.hits.size}{" "}
                  {cascade.hits.size === 1 ? "part" : "parts"})
                </p>
                <ul className="space-y-3">
                  {[...cascade.hits.entries()]
                    .sort(([, a], [, b]) => a.depth - b.depth)
                    .map(([id, hit]) => (
                      <li
                        key={id}
                        className="rounded-xl border border-border-hairline bg-plane px-3.5 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelect(id)}
                            className="text-left text-sm font-medium text-ink-primary transition-colors hover:text-accent-green hover:underline"
                          >
                            {nameOf(id)}
                          </button>
                          <span className="ml-auto shrink-0 rounded-full bg-accent-amber/15 px-2 py-0.5 text-[10px] font-medium text-accent-amber">
                            {hit.depth} {hit.depth === 1 ? "hop" : "hops"}
                          </span>
                        </div>
                        <ul className="mt-1.5 space-y-1">
                          {hit.via.map((v, i) => (
                            <li
                              key={i}
                              className="text-xs leading-relaxed text-ink-secondary"
                            >
                              {v.fromId !== selectedId && (
                                <span className="text-ink-muted">
                                  via {nameOf(v.fromId)}:{" "}
                                </span>
                              )}
                              {v.reason ?? "linked dependency"}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                </ul>
              </>
            )}

            {assemblyNeighbors.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Assembly connections ({assemblyNeighbors.length})
                </p>
                <ul className="space-y-1.5">
                  {assemblyNeighbors.map((id) => {
                    const n = nodeOf(id);
                    return (
                      <li key={id}>
                        <button
                          onClick={() => onSelect(id)}
                          className="flex w-full items-center gap-2 rounded-lg border border-border-hairline bg-plane px-3 py-2 text-left text-sm text-ink-primary transition-colors hover:border-accent-green/60"
                        >
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{
                              background: systemColor(
                                n?.system ?? "",
                                isDark,
                              ),
                            }}
                          />
                          {n?.name ?? id}
                          <ChevronRight
                            size={14}
                            className="ml-auto shrink-0 text-ink-muted"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

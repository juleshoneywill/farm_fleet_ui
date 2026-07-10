"use client";

import { useMemo, useState } from "react";
import type { PartsGraph } from "@/lib/api";
import { cascadeFrom } from "@/lib/cascade";
import { useIsDark } from "@/lib/useIsDark";
import { useForceLayout } from "./useForceLayout";
import EdgeLayer from "./EdgeLayer";
import NodeLayer from "./NodeLayer";
import SidePanel from "./SidePanel";
import { GRAPH_COLORS, SYSTEM_COLORS } from "./graphTheme";

const W = 1000;
const H = 700;

export default function PartsGraphView({ graph }: { graph: PartsGraph }) {
  const isDark = useIsDark();
  const colors = isDark ? GRAPH_COLORS.dark : GRAPH_COLORS.light;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const layout = useForceLayout(graph.nodes, graph.edges, W, H);
  const cascade = useMemo(
    () => (selectedId ? cascadeFrom(selectedId, graph.edges) : null),
    [selectedId, graph.edges],
  );

  const toggleSelect = (id: string) =>
    setSelectedId((prev) => (prev === id ? null : id));

  return (
    <div className="flex min-h-0 flex-1">
      <div className="relative min-w-0 flex-1">
        <Legend isDark={isDark} />
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
          onClick={() => setSelectedId(null)}
        >
          <defs>
            <marker
              id="arrow-dependency"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.dependency} />
            </marker>
          </defs>
          {layout && (
            <>
              <EdgeLayer
                links={layout.links}
                hasSelection={selectedId !== null}
                cascadeEdges={cascade?.edgeIndices ?? new Set()}
                colors={colors}
              />
              <NodeLayer
                nodes={layout.nodes}
                selectedId={selectedId}
                hits={cascade?.hits ?? null}
                onSelect={toggleSelect}
                colors={colors}
                isDark={isDark}
              />
            </>
          )}
        </svg>
      </div>
      <SidePanel
        graph={graph}
        selectedId={selectedId}
        cascade={cascade}
        onSelect={setSelectedId}
        onClear={() => setSelectedId(null)}
        isDark={isDark}
      />
    </div>
  );
}

function Legend({ isDark }: { isDark: boolean }) {
  const colors = isDark ? GRAPH_COLORS.dark : GRAPH_COLORS.light;
  return (
    <div className="absolute left-4 top-4 z-10 rounded-xl border border-border-hairline bg-surface/90 px-3.5 py-2.5 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {Object.entries(SYSTEM_COLORS).map(([system, pair]) => (
          <span
            key={system}
            className="flex items-center gap-1.5 text-xs capitalize text-ink-secondary"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: isDark ? pair.dark : pair.light }}
            />
            {system}
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-4 border-t border-border-hairline pt-2">
        <span className="flex items-center gap-1.5 text-xs text-ink-secondary">
          <svg width="26" height="8" aria-hidden>
            <line
              x1="1"
              y1="4"
              x2="25"
              y2="4"
              stroke={colors.structural}
              strokeWidth="1.5"
            />
          </svg>
          assembly
        </span>
        <span className="flex items-center gap-1.5 text-xs text-ink-secondary">
          <svg width="26" height="8" aria-hidden>
            <line
              x1="1"
              y1="4"
              x2="19"
              y2="4"
              stroke={colors.dependency}
              strokeWidth="1.75"
              strokeDasharray="4 3"
            />
            <path d="M 19 0.5 L 25 4 L 19 7.5 z" fill={colors.dependency} />
          </svg>
          reorder if it fails
        </span>
      </div>
    </div>
  );
}

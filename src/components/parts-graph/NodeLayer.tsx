"use client";

import type { CascadeHit } from "@/lib/cascade";
import type { LayoutNode } from "./useForceLayout";
import { NODE_R, systemColor, type GraphColors } from "./graphTheme";

export default function NodeLayer({
  nodes,
  selectedId,
  hits,
  onSelect,
  colors,
  isDark,
}: {
  nodes: LayoutNode[];
  selectedId: string | null;
  hits: Map<string, CascadeHit> | null;
  onSelect: (id: string) => void;
  colors: GraphColors;
  isDark: boolean;
}) {
  return (
    <g>
      {nodes.map((n) => {
        const selected = n.id === selectedId;
        const affected = hits?.has(n.id) ?? false;
        const dimmed = selectedId !== null && !selected && !affected;
        const showLabel = !dimmed;

        return (
          <g
            key={n.id}
            transform={`translate(${n.x ?? 0},${n.y ?? 0})`}
            opacity={dimmed ? 0.25 : 1}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(n.id);
            }}
          >
            <title>{`${n.name} (${n.system})`}</title>
            {selected && (
              <circle
                r={NODE_R + 5}
                fill="none"
                stroke={colors.ink}
                strokeWidth={2}
              />
            )}
            {affected && (
              <circle
                r={NODE_R + 4.5}
                fill="none"
                stroke={colors.dependency}
                strokeWidth={2}
              />
            )}
            <circle
              r={NODE_R}
              fill={systemColor(n.system, isDark)}
              stroke={colors.surface}
              strokeWidth={2}
            />
            {showLabel && (
              <text
                y={NODE_R + 14}
                textAnchor="middle"
                fontSize={11}
                fill={selected || affected ? colors.ink : colors.inkSecondary}
                fontWeight={selected || affected ? 600 : 400}
                stroke={colors.plane}
                strokeWidth={3}
                paintOrder="stroke"
              >
                {n.name}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

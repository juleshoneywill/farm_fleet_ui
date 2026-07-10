"use client";

import type { LayoutLink } from "./useForceLayout";
import { NODE_R, type GraphColors } from "./graphTheme";

// Two visually distinct edge treatments (never color alone): structural =
// thin solid gray, no arrow; dependency = dashed amber with an arrowhead.
// During a cascade everything dims except the dependency edges on the path.

export default function EdgeLayer({
  links,
  hasSelection,
  cascadeEdges,
  colors,
}: {
  links: LayoutLink[];
  hasSelection: boolean;
  cascadeEdges: Set<number>;
  colors: GraphColors;
}) {
  return (
    <g>
      {links.map((l) => {
        const x1 = l.source.x ?? 0;
        const y1 = l.source.y ?? 0;
        const x2 = l.target.x ?? 0;
        const y2 = l.target.y ?? 0;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        // Trim to the circle edge so arrowheads aren't buried under nodes.
        const sx = x1 + ux * (NODE_R + 2);
        const sy = y1 + uy * (NODE_R + 2);
        const ex = x2 - ux * (NODE_R + (l.type === "dependency" ? 7 : 2));
        const ey = y2 - uy * (NODE_R + (l.type === "dependency" ? 7 : 2));

        const onPath = cascadeEdges.has(l.edgeIndex);
        const dep = l.type === "dependency";
        const opacity = !hasSelection
          ? dep
            ? 0.85
            : 0.9
          : onPath
            ? 1
            : dep
              ? 0.12
              : 0.15;

        return (
          <line
            key={l.edgeIndex}
            x1={sx}
            y1={sy}
            x2={ex}
            y2={ey}
            stroke={dep ? colors.dependency : colors.structural}
            strokeWidth={onPath ? 2.5 : dep ? 1.75 : 1.5}
            strokeDasharray={dep ? "5 4" : undefined}
            markerEnd={dep ? "url(#arrow-dependency)" : undefined}
            opacity={opacity}
          />
        );
      })}
    </g>
  );
}

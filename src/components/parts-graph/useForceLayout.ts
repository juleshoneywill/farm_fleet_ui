"use client";

import { useEffect, useState } from "react";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from "d3-force";
import type { PartEdge, PartNode } from "@/lib/api";

export type LayoutNode = PartNode & SimulationNodeDatum;

export type LayoutLink = {
  edgeIndex: number; // index into the original PartsGraph.edges array
  type: PartEdge["type"];
  reason?: string | null;
  source: LayoutNode;
  target: LayoutNode;
};

export type Layout = { nodes: LayoutNode[]; links: LayoutLink[] };

// Runs a d3-force simulation over the parts graph and re-renders each
// animation frame until it settles -- a one-time "physics settle" intro.
// Structural edges are short and strong so the assembly tree forms the
// backbone; dependency edges are long and weak so they pull related parts
// closer without collapsing the tree shape.
export function useForceLayout(
  nodes: PartNode[],
  edges: PartEdge[],
  width: number,
  height: number,
): Layout | null {
  const [layout, setLayout] = useState<Layout | null>(null);

  useEffect(() => {
    if (nodes.length === 0) {
      setLayout(null);
      return;
    }

    const simNodes: LayoutNode[] = nodes.map((n) => ({ ...n }));
    const byId = new Map(simNodes.map((n) => [n.id, n]));
    const links: LayoutLink[] = edges.flatMap((e, edgeIndex) => {
      const source = byId.get(e.from);
      const target = byId.get(e.to);
      if (!source || !target) return []; // edge to an unknown part: skip
      return [{ edgeIndex, type: e.type, reason: e.reason, source, target }];
    });

    const sim = forceSimulation(simNodes)
      .force(
        "structural",
        forceLink(links.filter((l) => l.type === "structural"))
          .distance(70)
          .strength(0.8),
      )
      .force(
        "dependency",
        forceLink(links.filter((l) => l.type === "dependency"))
          .distance(150)
          .strength(0.08),
      )
      .force("charge", forceManyBody().strength(-400))
      .force("collide", forceCollide(44))
      .force("center", forceCenter(width / 2, height / 2))
      .force("x", forceX(width / 2).strength(0.05))
      .force("y", forceY(height / 2).strength(0.08))
      .stop();

    let raf = requestAnimationFrame(function step() {
      sim.tick();
      // simNodes are mutated in place; a fresh wrapper object per frame is
      // what makes React re-render.
      setLayout({ nodes: simNodes, links });
      if (sim.alpha() > sim.alphaMin()) raf = requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(raf);
  }, [nodes, edges, width, height]);

  return layout;
}

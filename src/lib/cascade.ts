import type { PartEdge } from "@/lib/api";

// BFS over the directed "dependency" edges only: from a failing part, find
// every part downstream that would also need reordering. Structural edges
// describe assembly, not consequence, so they never propagate the cascade.

export type CascadeHit = {
  depth: number; // hops from the failing part (1 = direct consequence)
  via: { fromId: string; reason: string | null }[];
};

export type Cascade = {
  hits: Map<string, CascadeHit>;
  // Indices into the original edges array of every dependency edge that
  // participates in the cascade, so the graph can highlight exactly those.
  edgeIndices: Set<number>;
};

export function cascadeFrom(startId: string, edges: PartEdge[]): Cascade {
  const adjacency = new Map<
    string,
    { to: string; reason: string | null; index: number }[]
  >();
  edges.forEach((e, index) => {
    if (e.type !== "dependency") return;
    const list = adjacency.get(e.from) ?? [];
    list.push({ to: e.to, reason: e.reason ?? null, index });
    adjacency.set(e.from, list);
  });

  const hits = new Map<string, CascadeHit>();
  const edgeIndices = new Set<number>();
  const seen = new Set([startId]);
  const queue: { id: string; depth: number }[] = [{ id: startId, depth: 0 }];

  while (queue.length) {
    const { id, depth } = queue.shift()!;
    for (const next of adjacency.get(id) ?? []) {
      if (next.to === startId) continue; // a cycle back to the failing part
      edgeIndices.add(next.index);
      const hit = hits.get(next.to);
      if (hit) {
        hit.via.push({ fromId: id, reason: next.reason });
      } else {
        hits.set(next.to, {
          depth: depth + 1,
          via: [{ fromId: id, reason: next.reason }],
        });
      }
      if (!seen.has(next.to)) {
        seen.add(next.to);
        queue.push({ id: next.to, depth: depth + 1 });
      }
    }
  }

  return { hits, edgeIndices };
}

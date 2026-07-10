const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Machine = {
  serial: string;
  make: string;
  model: string;
  type: string;
  status: string;
  mileage: number;
  owner: string;
};

export type MileagePoint = { at: string; mileage: number };
export type StatusPoint = { at: string; status: string };
export type ServiceEvent = {
  date: string;
  type: string;
  description: string;
  cost: number;
};

export type MachineHistory = {
  mileage: MileagePoint[];
  status: StatusPoint[];
  service: ServiceEvent[];
  costTotal: number;
};

// Parts-relationship graph for one machine. Two edge kinds: "structural"
// (physical assembly, tree-shaped) and "dependency" (directed "if this
// breaks, also reorder that", with a human-readable reason).
export type PartNode = { id: string; name: string; system: string };
export type PartEdge = {
  from: string;
  to: string;
  type: "structural" | "dependency";
  reason?: string | null;
};
export type PartsGraph = { nodes: PartNode[]; edges: PartEdge[] };

// One attribute as described by GET /api/schema -- the live Datomic schema,
// so the UI can render insert forms for whatever shape each entity type has.
export type SchemaAttr = {
  attr: string;
  valueType: "string" | "keyword" | "long" | "instant" | "ref" | string;
  cardinality: string;
  unique?: string;
  doc?: string;
};

export type Schema = Record<string, SchemaAttr[]>;

export type InsertResult =
  | { ok: true; txInstant: string; basisT: number }
  | { ok: false; errors: string[] };

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`${path} -> ${res.status}`);
  }
  return res.json();
}

export function getFleet(): Promise<Machine[]> {
  return getJSON("/api/fleet");
}

export function getFleetAsOf(date: string): Promise<Machine[]> {
  return getJSON(`/api/fleet/as-of?date=${encodeURIComponent(date)}`);
}

export function getMachine(serial: string): Promise<Machine> {
  return getJSON(`/api/machine/${encodeURIComponent(serial)}`);
}

export function getMachineHistory(serial: string): Promise<MachineHistory> {
  return getJSON(`/api/machine/${encodeURIComponent(serial)}/history`);
}

export function getPartsGraph(serial: string): Promise<PartsGraph> {
  return getJSON(`/api/machine/${encodeURIComponent(serial)}/parts-graph`);
}

export function getSchema(): Promise<Schema> {
  return getJSON("/api/schema");
}

// POST one entity of the given type (upserts machines by serial-no). The API
// answers 201, 400 {errors: [...]} or 409 {error: "..."} -- normalize all
// three into InsertResult so the form can render outcomes uniformly.
export async function insertEntity(
  ns: string,
  body: Record<string, unknown>,
): Promise<InsertResult> {
  const res = await fetch(`${API_URL}/api/entity/${encodeURIComponent(ns)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (res.ok) {
    return { ok: true, txInstant: data.txInstant, basisT: data.basisT };
  }
  return { ok: false, errors: data.errors ?? [data.error ?? `HTTP ${res.status}`] };
}

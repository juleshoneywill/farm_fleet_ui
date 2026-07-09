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

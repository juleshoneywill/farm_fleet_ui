"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Plus, RotateCcw } from "lucide-react";
import { getFleet, getFleetAsOf, type Machine } from "@/lib/api";
import StatCard from "@/components/StatCard";
import MachineCard from "@/components/MachineCard";
import { SkeletonCard, SkeletonStat } from "@/components/Skeleton";

export default function Home() {
  const [date, setDate] = useState("");
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const request = date ? getFleetAsOf(date) : getFleet();
    request
      .then((m) => {
        setMachines(m);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [date]);

  const changeDate = (value: string) => {
    setLoading(true);
    setDate(value);
  };

  const stats = useMemo(() => {
    const count = (status: string) =>
      machines.filter((m) => m.status === status).length;
    const totalMileage = machines.reduce((sum, m) => sum + m.mileage, 0);
    return {
      active: count("active"),
      underRepair: count("under-repair"),
      sold: count("sold"),
      totalMileage,
    };
  }, [machines]);

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-primary">
            Fleet overview
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            The same query, run against a different point in time — no
            valid_from/valid_to, just{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">
              d/as-of
            </code>
            .
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border-hairline bg-surface p-1.5">
            <div className="flex items-center gap-2 pl-2 text-ink-muted">
              <CalendarDays size={16} />
            </div>
            <input
              id="as-of"
              type="date"
              value={date}
              onChange={(e) => changeDate(e.target.value)}
              className="bg-transparent px-1 py-1 text-sm text-ink-primary outline-none"
            />
            <button
              onClick={() => changeDate("")}
              disabled={!date}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-ink-secondary transition-colors hover:bg-surface-2 disabled:opacity-40"
            >
              <RotateCcw size={13} />
              Today
            </button>
          </div>
          <Link
            href="/add"
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent-green px-3.5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Plus size={15} />
            Add data
          </Link>
        </div>
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-status-critical/30 bg-status-critical/10 px-4 py-3 text-sm text-ink-primary">
          Failed to load: {error}. Is the API running (
          <code className="text-xs">clojure -M:serve</code> in
          temporal_DB_demo)?
        </p>
      )}

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {loading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <StatCard label="Active" value={stats.active} accent />
            <StatCard label="Under repair" value={stats.underRepair} />
            <StatCard label="Sold" value={stats.sold} />
            <StatCard
              label="Total mileage"
              value={stats.totalMileage.toLocaleString()}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : machines.length === 0 ? (
          <div className="col-span-full rounded-xl border border-border-hairline bg-surface px-4 py-10 text-center text-ink-muted">
            No machines
          </div>
        ) : (
          machines.map((m) => <MachineCard key={m.serial} machine={m} />)
        )}
      </div>
    </main>
  );
}

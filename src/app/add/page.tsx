"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getFleet, getSchema, type Schema } from "@/lib/api";
import EntityForm from "@/components/EntityForm";

// The form is built from GET /api/schema at runtime, so each entity type
// renders whatever attributes it actually has -- machines and service events
// are shaped differently, and attributes added to the backend schema later
// show up here with no UI changes.
function AddData() {
  const params = useSearchParams();
  const [schema, setSchema] = useState<Schema | null>(null);
  const [machineSerials, setMachineSerials] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(
    params.get("type"),
  );

  useEffect(() => {
    Promise.all([getSchema(), getFleet()])
      .then(([s, fleet]) => {
        setSchema(s);
        setMachineSerials(fleet.map((m) => m.serial));
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <p className="rounded-xl border border-status-critical/30 bg-status-critical/10 px-4 py-3 text-sm text-ink-primary">
        Failed to load schema: {error}. Is the API running (
        <code className="text-xs">clojure -M:serve</code> in temporal_DB_demo)?
      </p>
    );
  }

  if (!schema) {
    return (
      <div className="h-64 animate-pulse rounded-xl border border-border-hairline bg-surface" />
    );
  }

  const types = Object.keys(schema).sort();
  const active = selected && schema[selected] ? selected : types[0];

  // Pre-fill ref attrs when arriving from a machine page (?machine=SERIAL).
  const machineParam = params.get("machine");
  const initial =
    machineParam && active
      ? Object.fromEntries(
          schema[active]
            .filter((a) => a.valueType === "ref")
            .map((a) => [a.attr, machineParam]),
        )
      : {};

  return (
    <>
      <div className="mb-6 flex items-center gap-1.5 rounded-xl border border-border-hairline bg-surface p-1.5 self-start w-fit">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            className={`rounded-lg px-3.5 py-1.5 text-sm capitalize transition-colors ${
              t === active
                ? "bg-accent-green/15 font-medium text-accent-green"
                : "text-ink-secondary hover:bg-surface-2"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <EntityForm
        key={active}
        ns={active}
        attrs={schema[active]}
        machineSerials={machineSerials}
        initial={initial}
        onSaved={() =>
          // a saved machine should be selectable in ref dropdowns right away
          getFleet()
            .then((fleet) => setMachineSerials(fleet.map((m) => m.serial)))
            .catch(() => {})
        }
      />
    </>
  );
}

export default function AddPage() {
  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-accent-green"
      >
        <ArrowLeft size={15} />
        Back to fleet
      </Link>

      <div className="mt-4 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-primary">
          Add data
        </h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Forms are generated from the live database schema — the API describes
          each entity&apos;s attributes and this page renders whatever it
          finds.
        </p>
      </div>

      <Suspense>
        <AddData />
      </Suspense>
    </main>
  );
}

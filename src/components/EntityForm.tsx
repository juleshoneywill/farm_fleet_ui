"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { insertEntity, type InsertResult, type SchemaAttr } from "@/lib/api";

// The backend requires an entity's identity attr (that's what upsert
// addresses by) and any ref attrs -- mirror that so the form can mark them.
const isRequired = (a: SchemaAttr) =>
  a.unique === "identity" || a.valueType === "ref";

// Attribute docs list example keywords (":tractor, :combine, ..."); surface
// them as datalist suggestions without restricting free entry.
const keywordSuggestions = (doc?: string): string[] =>
  doc ? [...doc.matchAll(/:([a-z][a-z0-9-]*)/g)].map((m) => m[1]) : [];

const prettyLabel = (attr: string) => attr.replace(/-/g, " ");

export default function EntityForm({
  ns,
  attrs,
  machineSerials,
  initial = {},
  onSaved,
}: {
  ns: string;
  attrs: SchemaAttr[];
  machineSerials: string[];
  initial?: Record<string, string>;
  onSaved?: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [asOf, setAsOf] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<InsertResult | null>(null);

  const setValue = (attr: string, v: string) =>
    setValues((prev) => ({ ...prev, [attr]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    const body: Record<string, unknown> = {};
    for (const a of attrs) {
      const raw = (values[a.attr] ?? "").trim();
      if (!raw) continue;
      body[a.attr] = a.valueType === "long" ? Number(raw) : raw;
    }
    if (asOf) body["as-of"] = asOf;
    try {
      const res = await insertEntity(ns, body);
      setResult(res);
      if (res.ok) onSaved?.();
    } catch (err) {
      setResult({ ok: false, errors: [(err as Error).message] });
    } finally {
      setSubmitting(false);
    }
  };

  // A machine upsert can be revisited on its detail page; find its serial via
  // the identity attribute rather than hardcoding "serial-no".
  const identityAttr = attrs.find((a) => a.unique === "identity")?.attr;
  const savedSerial =
    result?.ok && ns === "machine" && identityAttr
      ? values[identityAttr]?.trim()
      : undefined;

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-border-hairline bg-surface p-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {attrs.map((a) => (
          <label key={a.attr} className="flex flex-col gap-1.5">
            <span className="text-sm font-medium capitalize text-ink-primary">
              {prettyLabel(a.attr)}
              {isRequired(a) && (
                <span className="ml-1 text-status-critical">*</span>
              )}
            </span>
            <AttrInput
              ns={ns}
              attr={a}
              value={values[a.attr] ?? ""}
              onChange={(v) => setValue(a.attr, v)}
              machineSerials={machineSerials}
            />
            {a.doc && <span className="text-xs text-ink-muted">{a.doc}</span>}
          </label>
        ))}

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-primary">
            Backdate <span className="font-normal text-ink-muted">(optional)</span>
          </span>
          <input
            type="date"
            value={asOf}
            onChange={(e) => setAsOf(e.target.value)}
            className={inputClass}
          />
          <span className="text-xs text-ink-muted">
            Record this as if it happened in the past. Must be later than the
            newest fact in the database.
          </span>
        </label>
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-border-hairline pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-green px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? (
            <LoaderCircle size={15} className="animate-spin" />
          ) : (
            <Send size={15} />
          )}
          Save {ns}
        </button>
        {identityAttr && (
          <span className="text-xs text-ink-muted">
            Saving an existing {prettyLabel(identityAttr)} updates that {ns} —
            history is kept.
          </span>
        )}
      </div>

      {result && !result.ok && (
        <ul className="mt-4 space-y-1 rounded-xl border border-status-critical/30 bg-status-critical/10 px-4 py-3 text-sm text-ink-primary">
          {result.errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      {result?.ok && (
        <p className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-status-good/30 bg-status-good/10 px-4 py-3 text-sm text-ink-primary">
          <CheckCircle2 size={16} className="text-status-good" />
          Saved — recorded at{" "}
          {new Date(result.txInstant).toLocaleString()}.
          {savedSerial && (
            <Link
              href={`/machine/${savedSerial}`}
              className="font-medium text-accent-green hover:underline"
            >
              View {savedSerial}
            </Link>
          )}
        </p>
      )}
    </form>
  );
}

const inputClass =
  "rounded-lg border border-border-hairline bg-plane px-3 py-2 text-sm text-ink-primary outline-none transition-colors focus:border-accent-green/60";

function AttrInput({
  ns,
  attr,
  value,
  onChange,
  machineSerials,
}: {
  ns: string;
  attr: SchemaAttr;
  value: string;
  onChange: (v: string) => void;
  machineSerials: string[];
}) {
  switch (attr.valueType) {
    case "long":
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      );
    case "instant":
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      );
    case "ref":
      // Demo convention (matches the API): refs point at machines by serial.
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Select a machine…</option>
          {machineSerials.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      );
    case "keyword": {
      const suggestions = keywordSuggestions(attr.doc);
      const listId = `${ns}-${attr.attr}-options`;
      return (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            list={suggestions.length ? listId : undefined}
            className={inputClass}
          />
          {suggestions.length > 0 && (
            <datalist id={listId}>
              {suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          )}
        </>
      );
    }
    default:
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      );
  }
}

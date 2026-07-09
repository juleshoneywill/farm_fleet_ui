export default function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border-hairline bg-surface px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </div>
      <div
        className={`mt-1 text-2xl font-semibold [font-variant-numeric:tabular-nums] ${
          accent ? "text-accent-green" : "text-ink-primary"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

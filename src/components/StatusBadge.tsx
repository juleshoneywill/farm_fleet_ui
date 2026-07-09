// Status identity lives in the dot (the true, fixed status hue); the label
// text always stays in a legible ink tone -- the dataviz skill's "icon/mark +
// label, never color alone" mitigation for statuses that don't clear text
// contrast on their own (e.g. warning at 1.79:1 on the light surface).
const BG_COLOR: Record<string, string> = {
  active: "bg-status-good/15",
  "under-repair": "bg-status-warning/20",
  sold: "bg-surface-2",
  scrapped: "bg-status-critical/15",
};

export const DOT_COLOR: Record<string, string> = {
  active: "bg-status-good",
  "under-repair": "bg-status-warning",
  sold: "bg-ink-muted",
  scrapped: "bg-status-critical",
};

export default function StatusBadge({ status }: { status: string }) {
  const bg = BG_COLOR[status] ?? "bg-surface-2";
  const dot = DOT_COLOR[status] ?? "bg-ink-muted";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-ink-primary ${bg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

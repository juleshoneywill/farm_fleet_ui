import Link from "next/link";
import { machineIcon } from "./icons";
import StatusBadge from "./StatusBadge";
import type { Machine } from "@/lib/api";

export default function MachineCard({ machine }: { machine: Machine }) {
  const Icon = machineIcon(machine.type);
  return (
    <Link
      href={`/machine/${machine.serial}`}
      className="group flex flex-col gap-3 rounded-xl border border-border-hairline bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-accent-green/40 hover:shadow-lg hover:shadow-black/5"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/10 text-accent-green">
          {/* machineIcon always returns one of a fixed set of already-declared
              lucide components (never constructs a new one) -- stable per type. */}
          {/* eslint-disable-next-line react-hooks/static-components */}
          <Icon size={20} strokeWidth={2} />
        </span>
        <StatusBadge status={machine.status} />
      </div>

      <div>
        <div className="font-mono text-xs text-ink-muted">
          {machine.serial}
        </div>
        <div className="font-medium text-ink-primary group-hover:text-accent-green">
          {machine.make} {machine.model}
        </div>
        <div className="text-xs capitalize text-ink-muted">
          {machine.type}
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between border-t border-border-hairline pt-3 text-sm">
        <div>
          <div className="text-ink-muted text-xs">Mileage</div>
          <div className="font-medium text-ink-primary [font-variant-numeric:tabular-nums]">
            {machine.mileage.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-ink-muted text-xs">Owner</div>
          <div className="text-ink-secondary">{machine.owner}</div>
        </div>
      </div>
    </Link>
  );
}

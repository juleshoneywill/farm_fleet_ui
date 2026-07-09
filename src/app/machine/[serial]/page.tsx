"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipContentProps,
} from "recharts";
import {
  getMachine,
  getMachineHistory,
  type Machine,
  type MachineHistory,
} from "@/lib/api";
import { machineIcon, serviceIcon } from "@/components/icons";
import StatusBadge, { DOT_COLOR } from "@/components/StatusBadge";
import StatCard from "@/components/StatCard";
import { useIsDark } from "@/lib/useIsDark";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const fmtMoney = (amount: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(
    amount,
  );

const CHART_COLORS = {
  light: {
    line: "#2f6b3c",
    grid: "#e7e1d1",
    tooltipBg: "#fffdf8",
    border: "rgba(33,29,19,0.10)",
    ink: "#211d13",
    muted: "#948c74",
  },
  dark: {
    line: "#5ea86e",
    grid: "#2c2a22",
    tooltipBg: "#1c1a15",
    border: "rgba(245,242,233,0.10)",
    ink: "#f5f2e9",
    muted: "#948c74",
  },
};

function MileageTooltip({
  active,
  payload,
  colors,
}: TooltipContentProps & { colors: typeof CHART_COLORS.light }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-sm shadow-md"
      style={{
        background: colors.tooltipBg,
        borderColor: colors.border,
        color: colors.ink,
      }}
    >
      <div className="text-xs" style={{ color: colors.muted }}>
        {payload[0].payload.date}
      </div>
      <div className="font-medium [font-variant-numeric:tabular-nums]">
        {payload[0].value?.toLocaleString()} mi
      </div>
    </div>
  );
}

export default function MachineDetail({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = use(params);
  const [machine, setMachine] = useState<Machine | null>(null);
  const [history, setHistory] = useState<MachineHistory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isDark = useIsDark();
  const colors = isDark ? CHART_COLORS.dark : CHART_COLORS.light;

  useEffect(() => {
    Promise.all([getMachine(serial), getMachineHistory(serial)])
      .then(([m, h]) => {
        setMachine(m);
        setHistory(h);
      })
      .catch((e) => setError(e.message));
  }, [serial]);

  if (error) {
    return (
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-10">
        <BackLink />
        <p className="mt-4 rounded-xl border border-status-critical/30 bg-status-critical/10 px-4 py-3 text-sm text-ink-primary">
          Failed to load {serial}: {error}
        </p>
      </main>
    );
  }

  if (!machine || !history) {
    return (
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-10">
        <BackLink />
        <div className="mt-6 h-40 animate-pulse rounded-xl border border-border-hairline bg-surface" />
      </main>
    );
  }

  const Icon = machineIcon(machine.type);
  const chartData = history.mileage.map((p) => ({
    date: fmtDate(p.at),
    mileage: p.mileage,
  }));

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-10">
      <BackLink />

      <div className="mt-4 mb-8 flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
          {/* machineIcon/serviceIcon always return one of a fixed set of
              already-declared lucide components -- stable per type. */}
          {/* eslint-disable-next-line react-hooks/static-components */}
          <Icon size={24} strokeWidth={2} />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-ink-primary">
              {machine.make} {machine.model}
            </h1>
            <StatusBadge status={machine.status} />
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-ink-secondary">
            <span className="font-mono text-xs">{machine.serial}</span>
            <span className="text-ink-muted">&middot;</span>
            <MapPin size={13} className="text-ink-muted" />
            {machine.owner}
          </div>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Current mileage" value={machine.mileage.toLocaleString()} accent />
        <StatCard label="Service total" value={fmtMoney(history.costTotal)} />
        <StatCard label="Service events" value={history.service.length} />
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Mileage over time
        </h2>
        <div className="h-64 rounded-xl border border-border-hairline bg-surface p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke={colors.grid} vertical={false} />
              <XAxis
                dataKey="date"
                fontSize={12}
                tick={{ fill: colors.muted }}
                axisLine={{ stroke: colors.grid }}
                tickLine={false}
              />
              <YAxis
                fontSize={12}
                tick={{ fill: colors.muted }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip
                content={(props) => <MileageTooltip {...props} colors={colors} />}
              />
              <Line
                type="monotone"
                dataKey="mileage"
                stroke={colors.line}
                strokeWidth={2}
                dot={{ r: 4, fill: colors.line, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: colors.line, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Status history
        </h2>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-3 rounded-xl border border-border-hairline bg-surface p-4">
          {history.status.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && (
                <span className="mx-2 h-px w-6 bg-border-hairline" />
              )}
              <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${DOT_COLOR[s.status] ?? "bg-ink-muted"}`}
                />
                <span className="text-sm font-medium capitalize text-ink-primary">
                  {s.status}
                </span>
                <span className="text-xs text-ink-muted">
                  {fmtDate(s.at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Service history
          </h2>
          <span className="text-sm text-ink-secondary">
            Total to date:{" "}
            <span className="text-base font-semibold text-ink-primary [font-variant-numeric:tabular-nums]">
              {fmtMoney(history.costTotal)}
            </span>
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-border-hairline bg-surface">
          {history.service.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-ink-muted">
              No service events
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border-hairline text-left">
                <tr>
                  <th className="px-4 py-2.5 font-medium text-ink-muted">Date</th>
                  <th className="px-4 py-2.5 font-medium text-ink-muted">Type</th>
                  <th className="px-4 py-2.5 font-medium text-ink-muted">Description</th>
                  <th className="px-4 py-2.5 text-right font-medium text-ink-muted">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.service.map((s, i) => {
                  const ServiceIcon = serviceIcon(s.type);
                  return (
                    <tr
                      key={i}
                      className="border-t border-border-hairline first:border-t-0"
                    >
                      <td className="px-4 py-3 text-ink-secondary">
                        {fmtDate(s.date)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 capitalize text-ink-primary">
                          <ServiceIcon size={14} className="text-accent-green" />
                          {s.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-secondary">
                        {s.description}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-ink-primary [font-variant-numeric:tabular-nums]">
                        {fmtMoney(s.cost)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}

function BackLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-accent-green"
    >
      <ArrowLeft size={15} />
      Back to fleet
    </Link>
  );
}

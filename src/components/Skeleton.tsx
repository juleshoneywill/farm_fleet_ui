export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-hairline bg-surface p-4">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 animate-pulse rounded-lg bg-surface-2" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-surface-2" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-36 animate-pulse rounded bg-surface-2" />
      </div>
      <div className="mt-auto flex justify-between border-t border-border-hairline pt-3">
        <div className="h-4 w-14 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-20 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="rounded-xl border border-border-hairline bg-surface px-4 py-3">
      <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
      <div className="mt-2 h-7 w-10 animate-pulse rounded bg-surface-2" />
    </div>
  );
}

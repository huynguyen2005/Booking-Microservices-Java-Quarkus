export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-[var(--color-surface-subtle)] rounded-t-md mb-px" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-6 py-4 border-b border-[var(--color-border)]">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="skeleton h-4 flex-1 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-5">
          <div className="skeleton h-4 w-2/3 mb-4 rounded" />
          <div className="skeleton h-8 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="skeleton h-4 w-1/4 rounded" />
      <div className="skeleton h-10 w-full rounded" />
      <div className="skeleton h-4 w-1/4 rounded" />
      <div className="skeleton h-10 w-full rounded" />
      <div className="skeleton h-4 w-1/4 rounded" />
      <div className="skeleton h-10 w-full rounded" />
    </div>
  );
}

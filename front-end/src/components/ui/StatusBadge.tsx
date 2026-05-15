import { cn } from '../../lib/utils';

const statusMap: Record<string, string> = {
  ADMIN: 'bg-indigo-100 text-indigo-700',
  USER: 'bg-blue-100 text-blue-700',
  CREATED: 'bg-[var(--color-info-soft)] text-[var(--color-info)]',
  PENDING: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  PENDING_PAYMENT: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  PAID: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  CONFIRMED: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  ISSUED: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  CHECKED_IN: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  AVAILABLE: 'bg-emerald-100 text-emerald-700',
  HELD: 'bg-amber-100 text-amber-700',
  BOOKED: 'bg-rose-100 text-rose-700',
  FAILED: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
  CANCELLED: 'bg-gray-100 text-gray-600',
  EXPIRED: 'bg-gray-100 text-gray-600',
  SCHEDULED: 'bg-[var(--color-info-soft)] text-[var(--color-info)]',
};

const fallback = 'bg-gray-100 text-gray-600';

export function StatusBadge({ status, className }: { status: string | null | undefined; className?: string }) {
  const normalized = status?.toUpperCase() ?? 'UNKNOWN';
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full', statusMap[normalized] || fallback, className)}>
      {normalized}
    </span>
  );
}

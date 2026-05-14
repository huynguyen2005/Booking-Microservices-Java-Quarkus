import { cn } from '../../lib/utils';

const statusMap: Record<string, { bg: string; text: string; label?: string }> = {
  ADMIN:      { bg: 'bg-purple-100 text-purple-700', text: 'text-purple-700' },
  USER:       { bg: 'bg-blue-100 text-blue-700', text: 'text-blue-700' },
  CREATED:    { bg: 'bg-[var(--color-info-soft)] text-[var(--color-info)]', text: 'text-[var(--color-info)]' },
  PENDING:    { bg: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]', text: 'text-[var(--color-warning)]' },
  PAID:       { bg: 'bg-[var(--color-success-soft)] text-[var(--color-success)]', text: 'text-[var(--color-success)]' },
  ISSUED:     { bg: 'bg-[var(--color-success-soft)] text-[var(--color-success)]', text: 'text-[var(--color-success)]' },
  CHECKED_IN: { bg: 'bg-[var(--color-success-soft)] text-[var(--color-success)]', text: 'text-[var(--color-success)]' },
  FAILED:     { bg: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]', text: 'text-[var(--color-danger)]' },
  CANCELLED:  { bg: 'bg-gray-100 text-gray-600', text: 'text-gray-600' },
  SCHEDULED:  { bg: 'bg-[var(--color-info-soft)] text-[var(--color-info)]', text: 'text-[var(--color-info)]' },
};

const fallback = { bg: 'bg-gray-100 text-gray-600', text: 'text-gray-600' };

export function StatusBadge({ status, className }: { status: string | null | undefined; className?: string }) {
  const s = status?.toUpperCase() ?? 'UNKNOWN';
  const style = statusMap[s] || fallback;
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full', style.bg, className)}>
      {s}
    </span>
  );
}

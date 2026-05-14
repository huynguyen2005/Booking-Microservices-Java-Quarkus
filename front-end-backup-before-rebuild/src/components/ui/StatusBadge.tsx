const statusConfig: Record<string, { bg: string; text: string; label?: string }> = {
  CREATED:    { bg: 'bg-[var(--color-info-soft)]',    text: 'text-[var(--color-info)]' },
  PENDING:    { bg: 'bg-[var(--color-warning-soft)]',  text: 'text-[var(--color-warning)]' },
  PAID:       { bg: 'bg-[var(--color-success-soft)]',  text: 'text-[var(--color-success)]' },
  CHECKED_IN: { bg: 'bg-[var(--color-success-soft)]',  text: 'text-[var(--color-success)]', label: 'Checked In' },
  ISSUED:     { bg: 'bg-[var(--color-success-soft)]',  text: 'text-[var(--color-success)]' },
  FAILED:     { bg: 'bg-[var(--color-danger-soft)]',   text: 'text-[var(--color-danger)]' },
  SCHEDULED:  { bg: 'bg-[var(--color-info-soft)]',     text: 'text-[var(--color-info)]' },
  CANCELLED:  { bg: 'bg-[var(--color-danger-soft)]',   text: 'text-[var(--color-danger)]' },
  ADMIN:      { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-700 dark:text-purple-300' },
  USER:       { bg: 'bg-blue-100 dark:bg-blue-900',    text: 'text-blue-700 dark:text-blue-300' },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${cfg.bg} ${cfg.text}`}>
      {cfg.label ?? status}
    </span>
  );
}

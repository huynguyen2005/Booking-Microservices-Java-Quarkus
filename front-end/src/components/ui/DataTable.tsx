import { useState, useMemo, ReactNode, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 10,
  onRowClick,
  emptyMessage = 'Không có d? li?u.',
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setPage(0);
  }, [data.length]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paged = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  };

  if (data.length === 0) {
    return <div className="text-center py-12 text-[var(--color-text-muted)] text-sm">{emptyMessage}</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)]">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] ${col.sortable !== false ? 'cursor-pointer select-none hover:text-[var(--color-text-main)]' : ''} ${col.className ?? ''}`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.header}
                    {col.sortable !== false && <SortIcon colKey={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {paged.map((row, i) => (
              <tr
                key={i}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[var(--color-surface-subtle)]' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <td key={col.key} className={`px-5 py-3.5 text-[var(--color-text-main)] ${col.className ?? ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-text-muted)]">
            Hi?n th? {safePage * pageSize + 1}-{Math.min((safePage + 1) * pageSize, sorted.length)} / {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              disabled={safePage === 0}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i;
              else if (safePage < 3) pageNum = i;
              else if (safePage > totalPages - 4) pageNum = totalPages - 5 + i;
              else pageNum = safePage - 2 + i;

              return (
                <button
                  key={pageNum}
                  className={`w-8 h-8 text-xs font-medium rounded-md transition-colors ${safePage === pageNum ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              disabled={safePage === totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


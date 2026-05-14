import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketApi, Ticket } from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { Search } from 'lucide-react';

export default function AdminTicketsPage() {
  const { data: tickets, isLoading } = useQuery<Ticket[]>({ queryKey: ['adminTickets'], queryFn: ticketApi.getAllTickets });
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<Ticket | null>(null);

  const handleSearch = async () => {
    if (!searchCode.trim()) return;
    try { const t = await ticketApi.getByCode(searchCode.trim()); setSearchResult(t); } catch { toast.error('Không tìm thấy.'); setSearchResult(null); }
  };

  const columns: Column<Ticket>[] = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'User' },
    { key: 'ticketCode', header: 'Mã vé', render: t => <span className="font-mono font-bold text-[var(--color-primary)]">{t.ticketCode}</span> },
    { key: 'bookingId', header: 'Booking' },
    { key: 'passengerId', header: 'Passenger' },
    { key: 'flightId', header: 'Flight' },
    { key: 'seatNumber', header: 'Ghế', render: t => <span className="font-mono">{t.seatNumber}</span> },
    { key: 'status', header: 'Status', render: t => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Tickets</h1>
        <div className="flex items-center gap-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" /><input className="pl-9 w-64 text-sm" placeholder="Tìm theo mã vé..." value={searchCode} onChange={e => setSearchCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} /></div>
          <Button onClick={handleSearch} size="sm">Tìm</Button>
        </div>
      </div>
      {searchResult && (
        <div className="mb-4 p-4 bg-[var(--color-info-soft)] border border-[var(--color-info)] rounded-md text-sm">
          <p className="font-bold mb-1">Kết quả: {searchResult.ticketCode}</p>
          <p>Booking #{searchResult.bookingId} • Flight #{searchResult.flightId} • Ghế {searchResult.seatNumber} • <StatusBadge status={searchResult.status} /></p>
        </div>
      )}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={8} /></div> : <DataTable columns={columns} data={tickets ?? []} pageSize={10} />}
      </div>
    </div>
  );
}

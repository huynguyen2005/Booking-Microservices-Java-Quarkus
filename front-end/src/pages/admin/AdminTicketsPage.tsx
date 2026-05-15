import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketApi, Ticket } from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { Search } from 'lucide-react';

export default function AdminTicketsPage() {
  const [ticketCode, setTicketCode] = useState('');
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');

  const { data: tickets, isLoading } = useQuery<Ticket[]>({
    queryKey: ['adminTickets', ticketCode, status, userId],
    queryFn: () => ticketApi.search({ ticketCode: ticketCode || undefined, status: status || undefined, userId: userId ? Number(userId) : undefined }),
  });

  const columns: Column<Ticket>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'User' },
    { key: 'ticketCode', header: 'Mã vé', render: t => <span className="font-mono font-bold text-[var(--color-primary)]">{t.ticketCode}</span> },
    { key: 'bookingId', header: 'Booking' },
    { key: 'passengerId', header: 'Passenger' },
    { key: 'flightId', header: 'Flight' },
    { key: 'seatNumber', header: 'Gh?', render: t => <span className="font-mono">{t.seatNumber}</span> },
    { key: 'status', header: 'Tr?ng thái', render: t => <StatusBadge status={t.status} /> },
  ], []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Qu?n lý vé</h1>
      <div className="grid md:grid-cols-3 gap-2 mb-4">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" /><input className="pl-9" placeholder="Tìm theo mã vé" value={ticketCode} onChange={e => setTicketCode(e.target.value)} /></div>
        <select value={status} onChange={e => setStatus(e.target.value)}><option value="">T?t c? tr?ng thái</option><option value="ISSUED">ISSUED</option></select>
        <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={8} /></div> : <DataTable columns={columns} data={tickets ?? []} pageSize={10} />}
      </div>
    </div>
  );
}


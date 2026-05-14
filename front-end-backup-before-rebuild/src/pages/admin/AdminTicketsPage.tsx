import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketApi, Ticket } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Search } from 'lucide-react';

export default function AdminTicketsPage() {
  const { data: tickets, isLoading } = useQuery({ queryKey: ['adminTickets'], queryFn: ticketApi.getAllTickets });
  const [searchCode, setSearchCode] = useState('');
  const [apiCode, setApiCode] = useState('');

  const { data: searched, isLoading: searching, isError: searchErr } = useQuery({
    queryKey: ['ticketByCode', apiCode],
    queryFn: () => ticketApi.getByCode(apiCode),
    enabled: !!apiCode,
    retry: false
  });

  const handleSearch = () => {
    if (!searchCode.trim()) { toast.error('Nhập mã vé.'); return; }
    setApiCode(searchCode.trim().toUpperCase());
  };

  const display = apiCode ? (searched ? [searched] : []) : (tickets ?? []);

  const columns: Column<Ticket>[] = [
    { key: 'id', header: 'ID' },
    { key: 'ticketCode', header: 'Mã Vé', render: t => <span className="font-bold text-[var(--color-primary)] font-mono">{t.ticketCode}</span> },
    { key: 'bookingId', header: 'Booking', render: t => `BKG-${t.bookingId}` },
    { key: 'flightId', header: 'Chuyến bay', render: t => `FL-${t.flightId}` },
    { key: 'passengerId', header: 'Hành khách', render: t => `PSG-${t.passengerId}` },
    { key: 'seatNumber', header: 'Ghế', render: t => <span className="font-mono font-bold">{t.seatNumber}</span> },
    { key: 'status', header: 'Trạng thái', render: t => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Vé</h1>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Tìm mã vé..." className="h-10 pl-9 pr-3 w-56 border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm uppercase" value={searchCode} onChange={e => { setSearchCode(e.target.value); if (!e.target.value) setApiCode(''); }} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          </div>
          <Button size="sm" onClick={handleSearch} disabled={searching}>Tìm</Button>
        </div>
      </div>
      {apiCode && searchErr && <div className="mb-4 p-3 bg-[var(--color-danger-soft)] text-[var(--color-danger)] rounded-[var(--radius-sm)] text-sm">Không tìm thấy vé <strong>{apiCode}</strong>.</div>}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading || searching ? <div className="p-6"><TableSkeleton rows={6} cols={7} /></div> : <DataTable columns={columns} data={display} pageSize={10} />}
      </div>
    </div>
  );
}

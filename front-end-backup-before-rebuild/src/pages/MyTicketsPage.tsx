import { useQuery } from '@tanstack/react-query';
import { ticketApi, Ticket } from '../api/endpoints';
import { useState } from 'react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';
import { Search, Ticket as TicketIcon, QrCode } from 'lucide-react';

export default function MyTicketsPage() {
  const { data: tickets, isLoading } = useQuery<Ticket[]>({ queryKey: ['myTickets'], queryFn: ticketApi.getMyTickets });
  const [searchCode, setSearchCode] = useState('');
  const [apiSearchCode, setApiSearchCode] = useState('');

  // API search for specific ticket code
  const { data: searchedTicket, isLoading: searching, isError: searchError } = useQuery({
    queryKey: ['ticketByCode', apiSearchCode],
    queryFn: () => ticketApi.getByCode(apiSearchCode),
    enabled: !!apiSearchCode,
    retry: false,
  });

  const handleSearch = () => {
    if (!searchCode.trim()) {
      toast.error('Vui lòng nhập mã vé.');
      return;
    }
    setApiSearchCode(searchCode.trim().toUpperCase());
  };

  // Combine local filtered + API searched
  const displayTickets = apiSearchCode 
    ? (searchedTicket ? [searchedTicket] : []) 
    : tickets;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Vé máy bay của tôi</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-3 w-4 h-4 text-[var(--color-text-muted)]" />
            <input 
              type="text" 
              placeholder="Tìm theo mã vé..." 
              className="h-10 pl-9 pr-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] uppercase w-full md:w-64"
              value={searchCode}
              onChange={(e) => {
                setSearchCode(e.target.value);
                if (!e.target.value) setApiSearchCode('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button size="sm" onClick={handleSearch} disabled={searching}>
            {searching ? 'Đang tìm...' : 'Tìm'}
          </Button>
        </div>
      </div>

      {apiSearchCode && searchError && (
        <div className="mb-4 p-3 bg-[var(--color-danger-soft)] text-[var(--color-danger)] rounded-[var(--radius-sm)] text-sm">
          Không tìm thấy vé với mã <strong>{apiSearchCode}</strong>.
        </div>
      )}

      <div className="space-y-4">
        {isLoading || searching ? (
          <TableSkeleton rows={3} cols={4} />
        ) : displayTickets && displayTickets.length > 0 ? (
          displayTickets.map(t => (
            <div key={t.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-[var(--shadow-md)] transition-shadow">
              <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-dashed border-[var(--color-border)]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-medium text-[var(--color-text-muted)]">Mã vé điện tử</span>
                    <p className="text-2xl font-bold text-[var(--color-primary)] uppercase">{t.ticketCode}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <span className="text-xs text-[var(--color-text-muted)]">Chuyến bay</span>
                    <p className="font-bold text-[var(--color-text-main)]">FL-{t.flightId}</p>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-text-muted)]">Ghế ngồi</span>
                    <p className="font-bold text-[var(--color-text-main)]">{t.seatNumber}</p>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-text-muted)]">Mã đặt chỗ</span>
                    <p className="font-bold text-[var(--color-text-main)]">BKG-{t.bookingId}</p>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-text-muted)]">Mã hành khách</span>
                    <p className="font-bold text-[var(--color-text-main)]">PSG-{t.passengerId}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-[var(--color-primary-soft)] flex flex-col justify-center items-center min-w-[200px]">
                <div className="w-28 h-28 bg-[var(--color-surface)] border border-[var(--color-border)] p-2 rounded-[var(--radius-md)] mb-2 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-[var(--color-text-muted)] opacity-40" />
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">Quét mã khi check-in</p>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={<TicketIcon className="w-12 h-12" />}
            title="Chưa có vé nào"
            description={apiSearchCode ? 'Không tìm thấy vé phù hợp.' : 'Bạn chưa có vé máy bay nào.'}
          />
        )}
      </div>
    </div>
  );
}

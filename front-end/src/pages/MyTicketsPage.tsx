import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketApi, Ticket } from '../api/endpoints';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';
import { Ticket as TicketIcon, Search, Loader2, QrCode } from 'lucide-react';

export default function MyTicketsPage() {
  const { data: tickets, isLoading } = useQuery<Ticket[]>({ queryKey: ['myTickets'], queryFn: ticketApi.getMyTickets });
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<Ticket | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchCode.trim()) return;
    setSearching(true);
    try {
      const t = await ticketApi.getByCode(searchCode.trim());
      setSearchResult(t);
    } catch {
      toast.error('Không tìm thấy vé với mã này.');
      setSearchResult(null);
    } finally {
      setSearching(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>;

  const renderTicketCard = (t: Ticket) => (
    <div key={t.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden hover:shadow-md transition-all">
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-blue-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><TicketIcon className="w-5 h-5" /><span className="text-xs uppercase tracking-wide opacity-80">Boarding Pass</span></div>
          <StatusBadge status={t.status} className="!bg-white/20 !text-white" />
        </div>
        <p className="font-mono text-xl font-bold mt-2">{t.ticketCode}</p>
      </div>
      <div className="p-6 grid grid-cols-2 gap-4 text-sm">
        <div><p className="text-xs text-[var(--color-text-muted)] uppercase">Flight</p><p className="font-bold">#{t.flightId}</p></div>
        <div><p className="text-xs text-[var(--color-text-muted)] uppercase">Ghế</p><p className="font-mono font-bold text-lg">{t.seatNumber}</p></div>
        <div><p className="text-xs text-[var(--color-text-muted)] uppercase">Booking</p><p className="font-medium">#{t.bookingId}</p></div>
        <div><p className="text-xs text-[var(--color-text-muted)] uppercase">Passenger</p><p className="font-medium">#{t.passengerId}</p></div>
      </div>
      <div className="px-6 pb-6 flex justify-center">
        <div className="w-24 h-24 bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-md flex items-center justify-center">
          <QrCode className="w-12 h-12 text-[var(--color-text-muted)] opacity-40" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Vé của tôi</h1>

      {/* Search block */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" /><input className="pl-9 text-sm" placeholder="Nhập mã vé (VD: TCK-20260509-ABCD)" value={searchCode} onChange={e => setSearchCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} /></div>
        <Button onClick={handleSearch} disabled={searching}>Tìm</Button>
      </div>

      {searchResult && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3 uppercase tracking-wide">Kết quả tìm kiếm</h3>
          {renderTicketCard(searchResult)}
        </div>
      )}

      {!tickets || tickets.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <TicketIcon className="w-12 h-12 mx-auto text-[var(--color-text-muted)] opacity-30 mb-4" />
          <h3 className="text-lg font-semibold">Chưa có vé</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Sau khi thanh toán, vé sẽ tự động được phát hành.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {tickets.map(renderTicketCard)}
        </div>
      )}
    </div>
  );
}

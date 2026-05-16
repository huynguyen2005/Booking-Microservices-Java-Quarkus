import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketApi, Ticket, flightApi, Flight, Airport, Airplane } from '../api/endpoints';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Ticket as TicketIcon, Search, Loader2, QrCode } from 'lucide-react';

const formatServerDateTime = (value?: string | null) => {
  if (!value) return '—';
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);
  const parsed = new Date(hasTimezone ? value : `${value}Z`);
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
};

export default function MyTicketsPage() {
  const { data: tickets, isLoading } = useQuery<Ticket[]>({ queryKey: ['myTickets'], queryFn: ticketApi.getMyTickets });
  const { data: flights = [] } = useQuery<Flight[]>({ queryKey: ['flightsForTickets'], queryFn: flightApi.getFlights });
  const { data: airports = [] } = useQuery<Airport[]>({ queryKey: ['airportsForTickets'], queryFn: flightApi.getAirports });
  const { data: airplanes = [] } = useQuery<Airplane[]>({ queryKey: ['airplanesForTickets'], queryFn: flightApi.getAirplanes });
  const [searchCode, setSearchCode] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ISSUED' | 'CHECKED_IN' | 'CANCELLED'>('ALL');

  const airportMap = useMemo(
    () => Object.fromEntries(airports.map(a => [a.id, a])),
    [airports]
  );
  const airplaneMap = useMemo(
    () => Object.fromEntries(airplanes.map(a => [a.id, a])),
    [airplanes]
  );

  const filteredTickets = useMemo(() => {
    const keyword = searchCode.trim().toLowerCase();
    return (tickets ?? []).filter(t => {
      const status = (t.status ?? '').toUpperCase();
      const statusMatched = statusFilter === 'ALL' || status === statusFilter;
      if (!statusMatched) return false;
      if (!keyword) return true;
      return (t.ticketCode ?? '').toLowerCase().includes(keyword);
    });
  }, [tickets, searchCode, statusFilter]);

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>;

  const renderTicketCard = (t: Ticket) => {
    const flight = flights.find(f => f.id === t.flightId);
    const departureAirport = flight ? airportMap[flight.departureAirportId] : undefined;
    const arrivalAirport = flight ? airportMap[flight.arrivalAirportId] : undefined;
    const airplane = flight ? airplaneMap[flight.airplaneId] : undefined;
    const routeText = flight
      ? `${departureAirport?.code || `#${flight.departureAirportId}`} → ${arrivalAirport?.code || `#${flight.arrivalAirportId}`}`
      : `#${t.flightId}`;
    const routeDetailText = flight
      ? `${departureAirport?.name || `Sân bay #${flight.departureAirportId}`} → ${arrivalAirport?.name || `Sân bay #${flight.arrivalAirportId}`}`
      : '-';

    return (
      <div key={t.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden hover:shadow-md transition-all">
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-blue-700 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><TicketIcon className="w-5 h-5" /><span className="text-xs uppercase tracking-wide opacity-80">Boarding Pass</span></div>
            <StatusBadge status={t.status} className="!bg-white/20 !text-white" />
          </div>
          <p className="font-mono text-xl font-bold mt-2">{t.ticketCode}</p>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-[var(--color-text-muted)] uppercase">Chuyến bay</p><p className="font-bold">{routeText}</p></div>
          <div><p className="text-xs text-[var(--color-text-muted)] uppercase">Ghế</p><p className="font-mono font-bold text-lg">{t.seatNumber}</p></div>
          <div><p className="text-xs text-[var(--color-text-muted)] uppercase">Khởi hành</p><p className="font-medium">{formatServerDateTime(flight?.departureTime)}</p></div>
          <div><p className="text-xs text-[var(--color-text-muted)] uppercase">Mã chuyến</p><p className="font-medium">{flight?.flightNumber || `#${t.flightId}`}</p></div>
          <div className="col-span-2"><p className="text-xs text-[var(--color-text-muted)] uppercase">Tuyến chi tiết</p><p className="font-medium">{routeDetailText}</p></div>
          <div className="col-span-2"><p className="text-xs text-[var(--color-text-muted)] uppercase">Máy bay</p><p className="font-medium">{airplane?.model || airplane?.code || (flight ? `#${flight.airplaneId}` : '-')}</p></div>
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
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Vé của tôi</h1>

      <div className="grid md:grid-cols-2 gap-2 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            className="pl-9 text-sm"
            placeholder="Nhập mã vé (VD: TCK-20260509-ABCD)"
            value={searchCode}
            onChange={e => setSearchCode(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as 'ALL' | 'ISSUED' | 'CHECKED_IN' | 'CANCELLED')}>
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ISSUED">Đã phát hành</option>
          <option value="CHECKED_IN">Đã check-in</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      {!tickets || tickets.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <TicketIcon className="w-12 h-12 mx-auto text-[var(--color-text-muted)] opacity-30 mb-4" />
          <h3 className="text-lg font-semibold">Chưa có vé</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Sau khi thanh toán, vé sẽ tự động được phát hành.</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-[var(--color-text-muted)]">
          Không tìm thấy vé phù hợp bộ lọc.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredTickets.map(renderTicketCard)}
        </div>
      )}
    </div>
  );
}

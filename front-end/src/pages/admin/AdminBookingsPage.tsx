import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingApi, Booking } from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { Search } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookingId, setBookingId] = useState('');
  const [passengerId, setPassengerId] = useState('');
  const [flightId, setFlightId] = useState('');
  const [status, setStatus] = useState('');

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['adminBookings', bookingId, passengerId, flightId, status],
    queryFn: () => bookingApi.search({ bookingId: bookingId ? Number(bookingId) : undefined, passengerId: passengerId ? Number(passengerId) : undefined, flightId: flightId ? Number(flightId) : undefined, status: status || undefined }),
  });

  const columns: Column<Booking>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'User ID' },
    { key: 'passengerId', header: 'Passenger ID' },
    { key: 'flightId', header: 'Flight ID' },
    { key: 'seatNumber', header: 'Ghế', render: b => <span className="font-mono font-bold">{b.seatNumber}</span> },
    { key: 'status', header: 'Trạng thái', render: b => <StatusBadge status={b.status} /> },
  ], []);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý booking</h1>
      </div>
      <div className="grid md:grid-cols-4 gap-2 mb-4">
        <input placeholder="Booking ID" value={bookingId} onChange={e => setBookingId(e.target.value)} />
        <input placeholder="Passenger ID" value={passengerId} onChange={e => setPassengerId(e.target.value)} />
        <input placeholder="Flight ID" value={flightId} onChange={e => setFlightId(e.target.value)} />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <select className="pl-9" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={6} /></div> : <DataTable columns={columns} data={bookings ?? []} pageSize={10} />}
      </div>
    </div>
  );
}


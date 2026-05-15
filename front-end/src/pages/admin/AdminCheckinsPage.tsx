import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkinApi, passengerApi, bookingApi, flightApi, Checkin, Passenger, Booking, Flight } from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

export default function AdminCheckinsPage() {
  const [ticketCode, setTicketCode] = useState('');
  const [status, setStatus] = useState('');
  const [flightId, setFlightId] = useState('');

  const { data: checkins, isLoading } = useQuery<Checkin[]>({
    queryKey: ['adminCheckins', ticketCode, status, flightId],
    queryFn: () => checkinApi.search({ ticketCode: ticketCode || undefined, status: status || undefined, flightId: flightId ? Number(flightId) : undefined }),
  });
  const { data: passengers } = useQuery<Passenger[]>({ queryKey: ['allPassengers'], queryFn: passengerApi.getAllPassengers });
  const { data: bookings } = useQuery<Booking[]>({ queryKey: ['allBookings'], queryFn: bookingApi.getAllBookings });
  const { data: flights } = useQuery<Flight[]>({ queryKey: ['allFlights'], queryFn: flightApi.getFlights });

  const passengerMap = useMemo(() => Object.fromEntries((passengers ?? []).map(p => [p.id, p])), [passengers]);
  const bookingMap = useMemo(() => Object.fromEntries((bookings ?? []).map(b => [b.id, b])), [bookings]);
  const flightMap = useMemo(() => Object.fromEntries((flights ?? []).map(f => [f.id, f])), [flights]);

  const columns: Column<Checkin>[] = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'User' },
    { key: 'ticketCode', header: 'Mã vé', render: c => <span className="font-mono font-bold text-[var(--color-primary)]">{c.ticketCode}</span> },
    { key: 'bookingId', header: 'Booking', render: c => bookingMap[c.bookingId]?.bookingCode ?? c.bookingId },
    { key: 'passengerId', header: 'Hành khách', render: c => passengerMap[c.passengerId]?.fullName ?? c.passengerId },
    { key: 'flightId', header: 'Chuy?n bay', render: c => flightMap[c.flightId]?.flightNumber ?? c.flightId },
    { key: 'status', header: 'Tr?ng thái', render: c => <StatusBadge status={c.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Qu?n lý check-in</h1>
      <div className="grid md:grid-cols-3 gap-2 mb-4">
        <input placeholder="Ticket code" value={ticketCode} onChange={e => setTicketCode(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}><option value="">T?t c? tr?ng thái</option><option value="CHECKED_IN">CHECKED_IN</option></select>
        <input placeholder="Flight ID" value={flightId} onChange={e => setFlightId(e.target.value)} />
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={7} /></div> : <DataTable columns={columns} data={checkins ?? []} pageSize={10} />}
      </div>
    </div>
  );
}


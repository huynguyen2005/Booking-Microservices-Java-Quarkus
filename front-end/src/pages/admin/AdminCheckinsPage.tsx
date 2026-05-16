import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi, bookingApi, checkinApi, flightApi, passengerApi, Booking, Checkin, Flight, Passenger, User } from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

export default function AdminCheckinsPage() {
  const EMPTY_VALUE = '_';
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');

  const { data: checkins, isLoading } = useQuery<Checkin[]>({
    queryKey: ['adminCheckins', status],
    queryFn: () => checkinApi.search({ status: status || undefined }),
  });
  const { data: passengers } = useQuery<Passenger[]>({
    queryKey: ['allPassengersForCheckins'],
    queryFn: passengerApi.getAllPassengers,
  });
  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ['allBookingsForCheckins'],
    queryFn: bookingApi.getAllBookings,
  });
  const { data: flights } = useQuery<Flight[]>({
    queryKey: ['allFlightsForCheckins'],
    queryFn: flightApi.getFlights,
  });
  const { data: users } = useQuery<User[]>({
    queryKey: ['allUsersForCheckins'],
    queryFn: adminApi.getUsers,
  });

  const passengerMap = useMemo(() => Object.fromEntries((passengers ?? []).map(p => [p.id, p])), [passengers]);
  const bookingMap = useMemo(() => Object.fromEntries((bookings ?? []).map(b => [b.id, b])), [bookings]);
  const flightMap = useMemo(() => Object.fromEntries((flights ?? []).map(f => [f.id, f])), [flights]);
  const userMap = useMemo(() => Object.fromEntries((users ?? []).map(u => [u.id, u])), [users]);

  const columns: Column<Checkin>[] = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'Người dùng', render: c => userMap[c.userId]?.fullName ?? EMPTY_VALUE },
    { key: 'ticketCode', header: 'Mã vé', render: c => <span className="font-mono font-bold text-[var(--color-primary)]">{c.ticketCode || EMPTY_VALUE}</span> },
    { key: 'bookingId', header: 'Đặt chỗ', render: c => String(c.bookingId ?? EMPTY_VALUE) },
    { key: 'passengerId', header: 'Hành khách', render: c => passengerMap[c.passengerId]?.fullName ?? EMPTY_VALUE },
    { key: 'flightId', header: 'Chuyến bay', render: c => flightMap[c.flightId]?.flightNumber ?? EMPTY_VALUE },
    { key: 'status', header: 'Trạng thái', render: c => <StatusBadge status={c.status} /> },
  ];

  const filteredCheckins = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return checkins ?? [];
    return (checkins ?? []).filter(c => {
      const ticketCode = (c.ticketCode ?? '').toLowerCase();
      const passengerName = (passengerMap[c.passengerId]?.fullName ?? '').toLowerCase();
      const flightNumber = (flightMap[c.flightId]?.flightNumber ?? '').toLowerCase();
      return ticketCode.includes(normalized) || passengerName.includes(normalized) || flightNumber.includes(normalized);
    });
  }, [checkins, flightMap, keyword, passengerMap]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Quản lý check-in</h1>
      <div className="grid md:grid-cols-2 gap-2 mb-4">
        <input
          placeholder="Tìm theo mã vé / tên khách hàng / mã chuyến bay (VD: VJ999)"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="CHECKED_IN">CHECKED_IN</option>
        </select>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={7} /></div> : <DataTable columns={columns} data={filteredCheckins} pageSize={10} />}
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingApi, flightApi, Booking, Flight } from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

export default function AdminBookingsPage() {
  const { data: bookings, isLoading } = useQuery({ queryKey: ['adminBookings'], queryFn: bookingApi.getAllBookings });
  const { data: flights } = useQuery<Flight[]>({ queryKey: ['flightsList'], queryFn: flightApi.getFlights });

  const flightMap = useMemo(() => {
    const m: Record<number, Flight> = {};
    flights?.forEach(f => { m[f.id] = f; });
    return m;
  }, [flights]);

  const columns: Column<Booking>[] = [
    { key: 'id', header: 'Mã Booking', render: b => <span className="font-bold text-[var(--color-primary)]">BKG-{b.id}</span> },
    { key: 'userId', header: 'User ID' },
    { key: 'passengerId', header: 'Hành khách', render: b => `PSG-${b.passengerId}` },
    { key: 'flightId', header: 'Chuyến bay', render: b => <span className="font-medium">{flightMap[b.flightId]?.flightNumber ?? `FL-${b.flightId}`}</span> },
    { key: 'seatNumber', header: 'Ghế', render: b => <span className="font-mono font-bold">{b.seatNumber}</span> },
    { key: 'status', header: 'Trạng thái', render: b => <StatusBadge status={b.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Đặt chỗ</h1>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={6} cols={6} /></div> : <DataTable columns={columns} data={bookings ?? []} pageSize={10} />}
      </div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { bookingApi, Booking } from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

export default function AdminBookingsPage() {
  const { data: bookings, isLoading } = useQuery<Booking[]>({ queryKey: ['adminBookings'], queryFn: bookingApi.getAllBookings });
  const columns: Column<Booking>[] = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'User ID' },
    { key: 'passengerId', header: 'Passenger ID' },
    { key: 'flightId', header: 'Flight ID' },
    { key: 'seatNumber', header: 'Ghế', render: b => <span className="font-mono font-bold">{b.seatNumber}</span> },
    { key: 'status', header: 'Status', render: b => <StatusBadge status={b.status} /> },
  ];
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Quản lý Bookings</h1>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={6} /></div> : <DataTable columns={columns} data={bookings ?? []} pageSize={10} />}
      </div>
    </div>
  );
}

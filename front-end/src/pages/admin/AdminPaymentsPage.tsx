import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi, bookingApi, flightApi, passengerApi, paymentApi, Booking, Flight, Passenger, Payment, User } from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Eye } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const { data: rawPayments, isLoading } = useQuery<Payment[]>({
    queryKey: ['adminPayments', status],
    queryFn: () => paymentApi.search({ status: status || undefined }),
  });
  const { data: passengers } = useQuery<Passenger[]>({
    queryKey: ['adminPassengersForPayments'],
    queryFn: passengerApi.getAllPassengers,
  });
  const { data: users } = useQuery<User[]>({
    queryKey: ['adminUsersForPayments'],
    queryFn: adminApi.getUsers,
  });
  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ['adminBookingsForPayments'],
    queryFn: bookingApi.getAllBookings,
  });
  const { data: flights } = useQuery<Flight[]>({
    queryKey: ['adminFlightsForPayments'],
    queryFn: flightApi.getFlights,
  });

  const passengerMap = useMemo(
    () => Object.fromEntries((passengers ?? []).map(p => [p.id, p])),
    [passengers]
  );
  const userMap = useMemo(
    () => Object.fromEntries((users ?? []).map(u => [u.id, u])),
    [users]
  );
  const bookingMap = useMemo(
    () => Object.fromEntries((bookings ?? []).map(b => [b.id, b])),
    [bookings]
  );
  const flightMap = useMemo(
    () => Object.fromEntries((flights ?? []).map(f => [f.id, f])),
    [flights]
  );

  const columns: Column<Payment>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'Người dùng', render: p => userMap[p.userId]?.fullName || '—' },
    { key: 'bookingId', header: 'Đặt chỗ', render: p => bookingMap[p.bookingId]?.bookingCode || `BK-${p.bookingId}` },
    { key: 'passengerId', header: 'Hành khách', render: p => passengerMap[p.passengerId]?.fullName || '—' },
    { key: 'flightId', header: 'Chuyến bay', render: p => flightMap[p.flightId]?.flightNumber || '—' },
    { key: 'status', header: 'Trạng thái', render: p => <StatusBadge status={p.status} /> },
    {
      key: '_actions',
      header: '',
      sortable: false,
      render: p => (
        <div className="flex gap-1 justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedPayment(p)}
            title="Xem chi tiết"
            aria-label="Xem chi tiết thanh toán"
            className="hover:text-[var(--color-primary)] hover:bg-transparent focus:bg-transparent active:bg-transparent"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ], [bookingMap, flightMap, passengerMap, userMap]);

  const payments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return rawPayments ?? [];
    const keywordAsNumber = Number(keyword);
    const hasNumericKeyword = keyword !== '' && !Number.isNaN(keywordAsNumber);
    return (rawPayments ?? []).filter(p =>
      (hasNumericKeyword && (p.id === keywordAsNumber || p.bookingId === keywordAsNumber)) ||
      (userMap[p.userId]?.fullName ?? '').toLowerCase().includes(keyword) ||
      (passengerMap[p.passengerId]?.fullName ?? '').toLowerCase().includes(keyword)
    );
  }, [rawPayments, searchTerm, userMap, passengerMap]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Quản lý thanh toán</h1>
      <div className="grid md:grid-cols-2 gap-2 mb-4">
        <input placeholder="Tìm theo Payment ID / Booking ID / tên người dùng / tên hành khách" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="FAILED">FAILED</option>
        </select>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={7} /></div> : <DataTable columns={columns} data={payments} pageSize={10} />}
      </div>

      <Modal open={selectedPayment !== null} onClose={() => setSelectedPayment(null)} title="Chi tiết thanh toán" maxWidth="max-w-2xl">
        {selectedPayment && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--color-text-muted)]">Payment ID</p>
              <p className="font-semibold">{selectedPayment.id}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">Trạng thái</p>
              <div className="pt-1"><StatusBadge status={selectedPayment.status} /></div>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">User ID</p>
              <p className="font-semibold">{selectedPayment.userId}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">Booking ID</p>
              <p className="font-semibold">{selectedPayment.bookingId}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">Passenger ID</p>
              <p className="font-semibold">{selectedPayment.passengerId}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">Tên hành khách</p>
              <p className="font-semibold">{passengerMap[selectedPayment.passengerId]?.fullName || '-'}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">Flight ID</p>
              <p className="font-semibold">{selectedPayment.flightId}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">Ghế</p>
              <p className="font-semibold">{selectedPayment.seatNumber || '-'}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">Số tiền</p>
              <p className="font-semibold">{selectedPayment.amount != null ? selectedPayment.amount : '-'}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">Tiền tệ</p>
              <p className="font-semibold">{selectedPayment.currency || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[var(--color-text-muted)]">Thời gian thanh toán</p>
              <p className="font-semibold">{selectedPayment.paidAt ? new Date(selectedPayment.paidAt).toLocaleString('vi-VN') : '-'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

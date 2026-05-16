import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, Airport, Booking, bookingApi, Flight, flightApi, Passenger, passengerApi, User } from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { Eye, Search, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../components/ui/Toast';

export default function AdminBookingsPage() {
  const qc = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['adminBookingsAll'],
    queryFn: bookingApi.getAllBookings,
  });
  const { data: passengers } = useQuery<Passenger[]>({
    queryKey: ['adminPassengersForBookingSearch'],
    queryFn: passengerApi.getAllPassengers,
  });
  const { data: users } = useQuery<User[]>({
    queryKey: ['adminUsersForBookingList'],
    queryFn: adminApi.getUsers,
  });
  const { data: flights } = useQuery<Flight[]>({
    queryKey: ['adminFlightsForBookingList'],
    queryFn: flightApi.getFlights,
  });
  const { data: bookingDetail, isLoading: isDetailLoading } = useQuery<Booking>({
    queryKey: ['adminBookingDetail', selectedBookingId],
    queryFn: () => bookingApi.getById(selectedBookingId as number),
    enabled: selectedBookingId !== null,
  });
  const { data: userDetail } = useQuery<User>({
    queryKey: ['adminBookingUserDetail', bookingDetail?.userId],
    queryFn: () => adminApi.getUserById(bookingDetail?.userId as number),
    enabled: !!bookingDetail?.userId,
  });
  const { data: passengerDetail } = useQuery<Passenger>({
    queryKey: ['adminBookingPassengerDetail', bookingDetail?.passengerId],
    queryFn: () => passengerApi.getById(bookingDetail?.passengerId as number),
    enabled: !!bookingDetail?.passengerId,
  });
  const { data: flightDetail } = useQuery<Flight>({
    queryKey: ['adminBookingFlightDetail', bookingDetail?.flightId],
    queryFn: () => flightApi.getFlightById(bookingDetail?.flightId as number),
    enabled: !!bookingDetail?.flightId,
  });
  const { data: airports } = useQuery<Airport[]>({
    queryKey: ['allAirportsForBookingDetail'],
    queryFn: flightApi.getAirports,
    enabled: selectedBookingId !== null,
  });
  const cancelMut = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => bookingApi.adminCancelBooking(id, reason),
    onSuccess: () => {
      toast.success('Đã hủy booking thành công');
      setCancelTarget(null);
      setCancelReason('');
      qc.invalidateQueries({ queryKey: ['adminBookingsAll'] });
      if (selectedBookingId !== null) {
        qc.invalidateQueries({ queryKey: ['adminBookingDetail', selectedBookingId] });
      }
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || e.response?.data || 'Hủy booking thất bại');
    },
  });

  const airportMap = useMemo(
    () => Object.fromEntries((airports ?? []).map(a => [a.id, a])),
    [airports]
  );
  const passengerMap = useMemo(
    () => Object.fromEntries((passengers ?? []).map(p => [p.id, p])),
    [passengers]
  );
  const userMap = useMemo(
    () => Object.fromEntries((users ?? []).map(u => [u.id, u])),
    [users]
  );
  const flightMap = useMemo(
    () => Object.fromEntries((flights ?? []).map(f => [f.id, f])),
    [flights]
  );
  const columns: Column<Booking>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'Người dùng', render: b => userMap[b.userId]?.fullName || `#${b.userId}` },
    { key: 'passengerId', header: 'Hành khách', render: b => passengerMap[b.passengerId]?.fullName || `#${b.passengerId}` },
    {
      key: 'flightId',
      header: 'Chuyến bay',
      render: b => {
        const flight = flightMap[b.flightId];
        if (!flight) return '—';
        return flight.flightNumber || '—';
      },
    },
    { key: 'seatNumber', header: 'Ghế', render: b => <span className="font-mono font-bold">{b.seatNumber}</span> },
    { key: 'status', header: 'Trạng thái', render: b => <StatusBadge status={b.status} /> },
    {
      key: '_actions',
      header: '',
      sortable: false,
      className: 'text-right',
      render: b => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-transparent"
            onClick={() => setSelectedBookingId(b.id)}
            title="Xem chi tiết"
            aria-label="Xem chi tiết booking"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {(b.status ?? '').toUpperCase() === 'PENDING_PAYMENT' && (
            <Button
              size="icon"
              variant="ghost"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-transparent"
              onClick={() => setCancelTarget(b)}
              title="Hủy booking"
              aria-label="Hủy booking"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ], [airportMap, flightMap, passengerMap, userMap]);
  const filteredBookings = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const keywordAsNumber = Number(normalizedKeyword);
    const hasNumericKeyword = normalizedKeyword !== '' && !Number.isNaN(keywordAsNumber);

    return (bookings ?? []).filter(b => {
      const statusOk = !status || (b.status ?? '').toUpperCase() === status.toUpperCase();
      if (!statusOk) return false;
      if (!normalizedKeyword) return true;

      const passengerName = (passengerMap[b.passengerId]?.fullName ?? '').toLowerCase();
      const flightNumber = (flightMap[b.flightId]?.flightNumber ?? '').toLowerCase();

      const textMatch =
        passengerName.includes(normalizedKeyword) ||
        flightNumber.includes(normalizedKeyword);

      if (textMatch) return true;
      if (!hasNumericKeyword) return false;

      return b.id === keywordAsNumber;
    });
  }, [bookings, keyword, status, passengerMap, flightMap]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý booking</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            className="pl-9"
            placeholder="Tìm theo Booking ID / tên hành khách / mã chuyến bay (VD: VJ999)"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <select className="pl-9" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING_PAYMENT">Chờ thanh toán</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="CANCELLED">Đã hủy</option>
            <option value="EXPIRED">Quá hạn</option>
          </select>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={7} /></div> : <DataTable columns={columns} data={filteredBookings} pageSize={10} />}
      </div>

      <Modal
        open={selectedBookingId !== null}
        onClose={() => setSelectedBookingId(null)}
        title={`Chi tiết booking #${selectedBookingId ?? ''}`}
        maxWidth="max-w-2xl"
      >
        {isDetailLoading || !bookingDetail ? (
          <div className="text-sm text-[var(--color-text-muted)]">Đang tải chi tiết booking...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">ID</p>
              <p className="font-semibold">{bookingDetail.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">User ID</p>
              <p className="font-semibold">{bookingDetail.userId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">Tên user</p>
              <p className="font-semibold">{userDetail?.fullName || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">Email user</p>
              <p className="font-semibold">{userDetail?.email || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">Passenger ID</p>
              <p className="font-semibold">{bookingDetail.passengerId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">Tên hành khách</p>
              <p className="font-semibold">{passengerDetail?.fullName || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">Email hành khách</p>
              <p className="font-semibold">{passengerDetail?.email || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">Flight ID</p>
              <p className="font-semibold">{bookingDetail.flightId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">Mã chuyến bay</p>
              <p className="font-semibold">{flightDetail?.flightNumber || '-'}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-[var(--color-text-muted)]">Tuyến chuyến</p>
              <p className="font-semibold">
                {flightDetail
                  ? `${airportMap[flightDetail.departureAirportId]?.code || `#${flightDetail.departureAirportId}`} - ${airportMap[flightDetail.departureAirportId]?.name || ''} -> ${airportMap[flightDetail.arrivalAirportId]?.code || `#${flightDetail.arrivalAirportId}`} - ${airportMap[flightDetail.arrivalAirportId]?.name || ''}`
                  : '-'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">Ghế</p>
              <p className="font-semibold font-mono">{bookingDetail.seatNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">Trạng thái</p>
              <StatusBadge status={bookingDetail.status} />
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">Thời gian tạo</p>
              <p className="font-semibold">{bookingDetail.createdAt ? new Date(bookingDetail.createdAt).toLocaleString('vi-VN') : '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-muted)]">Cập nhật lần cuối</p>
              <p className="font-semibold">{bookingDetail.updatedAt ? new Date(bookingDetail.updatedAt).toLocaleString('vi-VN') : '-'}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={cancelTarget !== null}
        onClose={() => {
          if (!cancelMut.isPending) {
            setCancelTarget(null);
            setCancelReason('');
          }
        }}
        title={`Xác nhận hủy booking #${cancelTarget?.id ?? ''}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-3">
          <p className="text-sm text-[var(--color-text-muted)]">
            Hành động này chỉ áp dụng cho booking đang ở trạng thái PENDING_PAYMENT.
          </p>
          <div>
            <label className="block text-sm font-medium mb-1.5">Lý do hủy</label>
            <textarea
              rows={4}
              placeholder="Nhập lý do hủy (tối thiểu 5 ký tự)"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              disabled={cancelMut.isPending}
            />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button
              variant="ghost"
              onClick={() => {
                setCancelTarget(null);
                setCancelReason('');
              }}
              disabled={cancelMut.isPending}
            >
              Đóng
            </Button>
            <Button
              variant="destructive"
              disabled={cancelMut.isPending || cancelReason.trim().length < 5 || cancelTarget === null}
              onClick={() => {
                if (!cancelTarget) return;
                cancelMut.mutate({ id: cancelTarget.id, reason: cancelReason.trim() });
              }}
            >
              {cancelMut.isPending ? 'Đang hủy...' : 'Xác nhận hủy'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


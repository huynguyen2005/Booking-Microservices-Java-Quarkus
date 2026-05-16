import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  adminApi,
  bookingApi,
  checkinApi,
  flightApi,
  passengerApi,
  paymentApi,
  ticketApi,
  Ticket,
  User,
  Passenger,
  Flight,
} from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { Eye, Search, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../components/ui/Toast';

const EMPTY_VALUE = '_';

const formatDateTime = (value?: string | null) => {
  if (!value) return EMPTY_VALUE;
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);
  const parsed = new Date(hasTimezone ? value : `${value}Z`);
  return Number.isNaN(parsed.getTime()) ? EMPTY_VALUE : parsed.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
};

function getErrorMessage(e: any): string {
  const data = e?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (typeof data?.message === 'string' && data.message.trim()) return data.message;
  if (typeof e?.message === 'string' && e.message.trim()) return e.message;
  return 'Hủy vé thất bại';
}

export default function AdminTicketsPage() {
  const qc = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [cancelTarget, setCancelTarget] = useState<Ticket | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [detailTarget, setDetailTarget] = useState<Ticket | null>(null);

  const { data: tickets, isLoading } = useQuery<Ticket[]>({
    queryKey: ['adminTickets', status],
    queryFn: () => ticketApi.search({ status: status || undefined }),
  });
  const { data: users } = useQuery<User[]>({
    queryKey: ['adminUsersForTickets'],
    queryFn: adminApi.getUsers,
  });
  const { data: passengers } = useQuery<Passenger[]>({
    queryKey: ['adminPassengersForTickets'],
    queryFn: passengerApi.getAllPassengers,
  });
  const { data: flights } = useQuery<Flight[]>({
    queryKey: ['adminFlightsForTickets'],
    queryFn: flightApi.getFlights,
  });

  const userMap = useMemo(() => Object.fromEntries((users ?? []).map(u => [u.id, u])), [users]);
  const passengerMap = useMemo(() => Object.fromEntries((passengers ?? []).map(p => [p.id, p])), [passengers]);
  const flightMap = useMemo(() => Object.fromEntries((flights ?? []).map(f => [f.id, f])), [flights]);

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery({
    queryKey: ['adminTicketDetail', detailTarget?.id, detailTarget?.bookingId, detailTarget?.passengerId, detailTarget?.flightId, detailTarget?.ticketCode],
    enabled: detailTarget !== null,
    queryFn: async () => {
      if (!detailTarget) return null;
      const [booking, passenger, payment, checkin, flight, airports, airplanes] = await Promise.all([
        bookingApi.getById(detailTarget.bookingId).catch(() => null),
        passengerApi.getById(detailTarget.passengerId).catch(() => null),
        paymentApi.getByBooking(detailTarget.bookingId).catch(() => null),
        checkinApi.getByTicket(detailTarget.ticketCode).catch(() => null),
        flightApi.getFlightById(detailTarget.flightId).catch(() => null),
        flightApi.getAirports().catch(() => []),
        flightApi.getAirplanes().catch(() => []),
      ]);

      const departureAirport = flight ? airports.find(a => a.id === flight.departureAirportId) : null;
      const arrivalAirport = flight ? airports.find(a => a.id === flight.arrivalAirportId) : null;
      const airplane = flight ? airplanes.find(a => a.id === flight.airplaneId) : null;

      return { booking, passenger, payment, checkin, flight, departureAirport: departureAirport ?? null, arrivalAirport: arrivalAirport ?? null, airplane: airplane ?? null };
    },
  });

  const cancelMut = useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: number; reason: string }) => bookingApi.adminCancelBooking(bookingId, reason),
    onSuccess: () => {
      toast.success('Đã hủy vé thành công');
      setCancelTarget(null);
      setCancelReason('');
      qc.invalidateQueries({ queryKey: ['adminTickets'] });
      qc.invalidateQueries({ queryKey: ['adminBookingsAll'] });
      qc.invalidateQueries({ queryKey: ['allCheckins'] });
    },
    onError: (e: any) => {
      toast.error(getErrorMessage(e));
      setCancelTarget(null);
      setCancelReason('');
    },
  });

  const filteredTickets = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return tickets ?? [];
    return (tickets ?? []).filter(t =>
      (t.ticketCode ?? '').toLowerCase().includes(normalized) ||
      String(t.userId ?? '').includes(normalized) ||
      String(t.bookingId ?? '').includes(normalized) ||
      String(t.passengerId ?? '').includes(normalized) ||
      String(t.flightId ?? '').includes(normalized)
    );
  }, [tickets, keyword]);

  const columns: Column<Ticket>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'Người dùng', render: t => userMap[t.userId]?.fullName || EMPTY_VALUE },
    { key: 'ticketCode', header: 'Mã vé', render: t => <span className="font-mono font-bold text-[var(--color-primary)]">{t.ticketCode || EMPTY_VALUE}</span> },
    { key: 'bookingId', header: 'Đặt chỗ', render: t => String(t.bookingId ?? EMPTY_VALUE) },
    { key: 'passengerId', header: 'Hành khách', render: t => passengerMap[t.passengerId]?.fullName || EMPTY_VALUE },
    { key: 'flightId', header: 'Chuyến bay', render: t => flightMap[t.flightId]?.flightNumber || EMPTY_VALUE },
    { key: 'seatNumber', header: 'Ghế', render: t => <span className="font-mono">{t.seatNumber || EMPTY_VALUE}</span> },
    { key: 'status', header: 'Trạng thái', render: t => <StatusBadge status={t.status} /> },
    {
      key: '_actions',
      header: '',
      sortable: false,
      className: 'text-right',
      render: t => {
        const s = (t.status ?? '').toUpperCase();
        const canCancel = s !== 'CHECKED_IN' && s !== 'CANCELLED';
        return (
          <div className="flex justify-end items-center gap-1">
            <Button size="sm" variant="ghost" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-transparent" onClick={() => setDetailTarget(t)} title="Xem chi tiết vé">
              <Eye className="w-4 h-4" />
            </Button>
            {!canCancel ? null : (
              <Button size="sm" variant="ghost" className="text-[var(--color-danger)] hover:bg-transparent" onClick={() => setCancelTarget(t)}>
                <Trash2 className="w-4 h-4 mr-1" /> Hủy vé
              </Button>
            )}
          </div>
        );
      },
    },
  ], [flightMap, passengerMap, userMap]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Quản lý vé</h1>
      <div className="grid md:grid-cols-2 gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input className="pl-9" placeholder="Tìm theo mã vé / User / Booking / Passenger / Flight" value={keyword} onChange={e => setKeyword(e.target.value)} />
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="ISSUED">Đã phát hành</option>
          <option value="CHECKED_IN">Đã check-in</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={9} /></div> : <DataTable columns={columns} data={filteredTickets} pageSize={10} />}
      </div>

      <Modal open={detailTarget !== null} onClose={() => setDetailTarget(null)} title={`Chi tiết vé #${detailTarget?.id ?? ''}`} maxWidth="max-w-3xl">
        {!detailTarget ? null : (
          <div className="space-y-4 text-sm">
            {isDetailLoading ? (
              <p className="text-[var(--color-text-muted)]">Đang tải chi tiết vé...</p>
            ) : isDetailError ? (
              <p className="text-[var(--color-danger)]">Không tải được đầy đủ dữ liệu chi tiết. Vui lòng thử lại.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-2">Thông tin vé</p>
                  <div className="grid md:grid-cols-3 gap-2">
                    <div><p className="text-[var(--color-text-muted)]">Mã vé</p><p className="font-mono font-semibold text-[var(--color-primary)]">{detailTarget.ticketCode || EMPTY_VALUE}</p></div>
                    <div><p className="text-[var(--color-text-muted)]">Trạng thái vé</p><StatusBadge status={detailTarget.status} /></div>
                    <div><p className="text-[var(--color-text-muted)]">Ghế</p><p className="font-medium">{detailTarget.seatNumber || EMPTY_VALUE}</p></div>
                    <div><p className="text-[var(--color-text-muted)]">ID vé</p><p className="font-medium">{detailTarget.id}</p></div>
                    <div><p className="text-[var(--color-text-muted)]">User ID</p><p className="font-medium">{detailTarget.userId}</p></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-2">Booking và thanh toán</p>
                  <div className="grid md:grid-cols-3 gap-2">
                    <div><p className="text-[var(--color-text-muted)]">Booking ID</p><p className="font-medium">{detailTarget.bookingId}</p></div>
                    <div><p className="text-[var(--color-text-muted)]">Trạng thái booking</p><StatusBadge status={detailData?.booking?.status} /></div>
                    <div><p className="text-[var(--color-text-muted)]">Tạo booking</p><p className="font-medium">{formatDateTime(detailData?.booking?.createdAt)}</p></div>
                    <div><p className="text-[var(--color-text-muted)]">Cập nhật booking</p><p className="font-medium">{formatDateTime(detailData?.booking?.updatedAt)}</p></div>
                    <div><p className="text-[var(--color-text-muted)]">Trạng thái thanh toán</p><StatusBadge status={detailData?.payment?.status} /></div>
                    <div><p className="text-[var(--color-text-muted)]">Số tiền</p><p className="font-medium">{detailData?.payment?.amount != null ? `${detailData.payment.amount} ${detailData.payment.currency || ''}`.trim() : EMPTY_VALUE}</p></div>
                    <div><p className="text-[var(--color-text-muted)]">Thời điểm thanh toán</p><p className="font-medium">{formatDateTime(detailData?.payment?.paidAt)}</p></div>
                  </div>
                </div>
              </div>
            )}
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
        title={`Xác nhận hủy vé #${cancelTarget?.id ?? ''}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-3">
          <p className="text-sm text-[var(--color-text-muted)]">Hệ thống sẽ hủy booking liên quan đến vé này nếu vé chưa check-in.</p>
          <div>
            <label className="block text-sm font-medium mb-1.5">Lý do hủy</label>
            <textarea rows={4} placeholder="Nhập lý do hủy (tối thiểu 5 ký tự)" value={cancelReason} onChange={e => setCancelReason(e.target.value)} disabled={cancelMut.isPending} />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button variant="ghost" onClick={() => { setCancelTarget(null); setCancelReason(''); }} disabled={cancelMut.isPending}>Đóng</Button>
            <Button
              variant="destructive"
              disabled={cancelMut.isPending || cancelReason.trim().length < 5 || cancelTarget === null}
              onClick={() => {
                if (!cancelTarget) return;
                cancelMut.mutate({ bookingId: cancelTarget.bookingId, reason: cancelReason.trim() });
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

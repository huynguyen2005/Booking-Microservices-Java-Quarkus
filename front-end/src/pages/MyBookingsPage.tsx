import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bookingApi, Booking, flightApi, passengerApi, paymentApi } from '../api/endpoints';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Ticket, CreditCard, Loader2, Plane, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';

const formatServerDateTime = (value?: string | null) => {
  if (!value) return '—';
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);
  const parsed = new Date(hasTimezone ? value : `${value}Z`);
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
};

export default function MyBookingsPage() {
  const qc = useQueryClient();
  const [cancelId, setCancelId] = useState<number | null>(null);

  const { data: bookings, isLoading } = useQuery<Booking[]>({ queryKey: ['myBookings'], queryFn: bookingApi.getMyBookings });
  const { data: flights = [] } = useQuery({ queryKey: ['flights'], queryFn: flightApi.getFlights });
  const { data: passengers = [] } = useQuery({ queryKey: ['myPassengers'], queryFn: passengerApi.getMyPassengers });
  const { data: payments = [] } = useQuery({ queryKey: ['myPayments'], queryFn: paymentApi.getMyPayments });

  const cancelMut = useMutation({
    mutationFn: bookingApi.cancelBooking,
    onSuccess: () => {
      toast.success('Booking đã được hủy.');
      setCancelId(null);
      qc.invalidateQueries({ queryKey: ['myBookings'] });
      qc.invalidateQueries({ queryKey: ['myPayments'] });
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || e.response?.data || 'Không thể hủy booking');
      setCancelId(null);
    },
  });

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>;

  const formatMoney = (amount: number | null | undefined, currency: string | null | undefined) =>
    `${Number(amount ?? 0).toLocaleString('vi-VN')} ${(currency ?? 'VND').toUpperCase()}`;

  const paymentStatusText = (status: string | null | undefined) => {
    const s = (status ?? '').toUpperCase();
    if (s === 'PAID') return 'Đã thanh toán';
    if (s === 'PENDING') return 'Chờ thanh toán';
    if (s === 'FAILED') return 'Thanh toán thất bại';
    return 'Chưa có payment';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Đặt chỗ của tôi</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">Theo dõi tình trạng đặt chỗ, thanh toán, thông tin hành khách và chuyến bay.</p>

      {!bookings || bookings.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <Ticket className="w-12 h-12 mx-auto text-[var(--color-text-muted)] opacity-30 mb-4" />
          <h3 className="text-lg font-semibold">Chưa có đặt chỗ</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-4">Đặt vé máy bay để bắt đầu.</p>
          <Link to="/flights" className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-sm)] font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
            <Plane className="w-4 h-4" /> Tìm chuyến bay
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {bookings.map(b => {
            const isPendingPayment = (b.status ?? '').toUpperCase() === 'PENDING_PAYMENT';
            const flight = flights.find(f => f.id === b.flightId);
            const passenger = passengers.find(p => p.id === b.passengerId);
            const payment = payments.find(p => p.bookingId === b.id);

            return (
              <div key={b.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-5 hover:shadow-sm transition-all">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[var(--color-text-main)]">Booking #{b.id}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  {isPendingPayment && (
                    <div className="flex items-center gap-2">
                      <Link to={`/my-payments?bookingId=${b.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline">
                        <CreditCard className="w-4 h-4" /> Thanh toán
                      </Link>
                      <Button variant="ghost" size="sm" className="text-[var(--color-danger)]" onClick={() => setCancelId(b.id)}>
                        <XCircle className="w-4 h-4 mr-1" /> Hủy
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-[var(--color-text-muted)]">
                  <span>Mã booking: <span className="font-medium text-[var(--color-text-main)]">{b.bookingCode || `#${b.id}`}</span></span>
                  <span>Chuyến bay: <span className="font-medium text-[var(--color-text-main)]">{flight?.flightNumber || `#${b.flightId}`}</span></span>
                  <span>Ghế: <span className="font-mono font-bold text-[var(--color-text-main)]">{b.seatNumber}</span></span>
                  <span>Hành khách: <span className="font-medium text-[var(--color-text-main)]">{passenger?.fullName || `#${b.passengerId}`}</span></span>
                  <span>Email hành khách: <span className="font-medium text-[var(--color-text-main)]">{passenger?.email || 'Chưa cập nhật'}</span></span>
                  <span>Số hộ chiếu: <span className="font-medium text-[var(--color-text-main)]">{passenger?.passportNumber || 'Chưa cập nhật'}</span></span>
                  <span>Trạng thái thanh toán: <span className="font-medium text-[var(--color-text-main)]">{paymentStatusText(payment?.status)}</span></span>
                  <span>Số tiền: <span className="font-medium text-[var(--color-text-main)]">{formatMoney(payment?.amount, payment?.currency)}</span></span>
                  <span>Tạo lúc: <span className="font-medium text-[var(--color-text-main)]">{formatServerDateTime(b.createdAt)}</span></span>
                  <span>Cập nhật lúc: <span className="font-medium text-[var(--color-text-main)]">{formatServerDateTime(b.updatedAt)}</span></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={cancelId !== null}
        onClose={() => setCancelId(null)}
        onConfirm={() => cancelId && cancelMut.mutate(cancelId)}
        title="Hủy booking"
        message="Bạn chắc chắn muốn hủy booking này?"
        confirmText="Hủy booking"
        variant="danger"
        loading={cancelMut.isPending}
      />
    </div>
  );
}

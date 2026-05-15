import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { paymentApi, ticketApi, bookingApi, flightApi, passengerApi, Payment } from '../api/endpoints';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function MyPaymentsPage() {
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const bookingIdParam = searchParams.get('bookingId');
  const bookingId = bookingIdParam ? Number(bookingIdParam) : undefined;

  const { data: payments, isLoading, refetch } = useQuery<Payment[]>({ queryKey: ['myPayments'], queryFn: paymentApi.getMyPayments });
  const { data: flights = [] } = useQuery({ queryKey: ['flights'], queryFn: flightApi.getFlights });
  const { data: passengers = [] } = useQuery({ queryKey: ['myPassengers'], queryFn: passengerApi.getMyPassengers });
  const { data: myBookings = [] } = useQuery({ queryKey: ['myBookings'], queryFn: bookingApi.getMyBookings });

  const [action, setAction] = useState<{ id: number; type: 'success' | 'fail'; bookingId: number } | null>(null);
  const [pollingBookingId, setPollingBookingId] = useState<number | null>(null);

  const successMut = useMutation({
    mutationFn: paymentApi.simulateSuccess,
    onSuccess: () => {
      if (!action) return;
      toast.success('Thanh toán thành công. Đang đồng bộ booking/vé...');
      setPollingBookingId(action.bookingId);
      setAction(null);
      qc.invalidateQueries({ queryKey: ['myPayments'] });
      qc.invalidateQueries({ queryKey: ['myBookings'] });
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || e.response?.data || 'Thanh toán thất bại');
      setAction(null);
    },
  });

  const failMut = useMutation({
    mutationFn: paymentApi.simulateFail,
    onSuccess: () => {
      toast.info('Thanh toán đã được đánh dấu thất bại.');
      setAction(null);
      qc.invalidateQueries({ queryKey: ['myPayments'] });
      qc.invalidateQueries({ queryKey: ['myBookings'] });
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || e.response?.data || 'Không thể cập nhật trạng thái thất bại');
      setAction(null);
    },
  });

  useEffect(() => {
    if (!pollingBookingId) return;

    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      try {
        const [booking, tickets] = await Promise.all([
          bookingApi.getById(pollingBookingId),
          ticketApi.getByBooking(pollingBookingId),
        ]);

        const bookingReady = ['CONFIRMED', 'PAID'].includes((booking.status ?? '').toUpperCase());
        const hasIssuedTicket = tickets.some(t => (t.status ?? '').toUpperCase() === 'ISSUED');

        if (bookingReady && hasIssuedTicket) {
          clearInterval(timer);
          setPollingBookingId(null);
          toast.success('Booking đã xác nhận và vé đã được phát hành.');
          qc.invalidateQueries({ queryKey: ['myTickets'] });
          qc.invalidateQueries({ queryKey: ['myBookings'] });
          refetch();
          return;
        }
      } catch {
        // keep polling
      }

      if (attempts >= 10) {
        clearInterval(timer);
        setPollingBookingId(null);
        toast.info('Hệ thống đang xử lý bất đồng bộ. Vui lòng kiểm tra lại sau.');
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [pollingBookingId, qc, refetch]);

  const filtered = useMemo(() => {
    if (!payments) return [];
    if (!bookingId) return payments;
    return payments.filter(p => p.bookingId === bookingId);
  }, [payments, bookingId]);

  const paymentStatusText = (status: string | null | undefined) => {
    const normalized = (status ?? '').toUpperCase();
    if (normalized === 'PAID') return 'Đã thanh toán';
    if (normalized === 'PENDING') return 'Chờ thanh toán';
    if (normalized === 'FAILED') return 'Thanh toán thất bại';
    return 'Không xác định';
  };

  const bookingStatusText = (status: string | null | undefined) => {
    const normalized = (status ?? '').toUpperCase();
    if (normalized === 'PENDING_PAYMENT') return 'Chờ thanh toán';
    if (normalized === 'CONFIRMED') return 'Đã xác nhận';
    if (normalized === 'PAID') return 'Đã thanh toán';
    if (normalized === 'CANCELLED') return 'Đã hủy';
    return normalized || 'Không xác định';
  };

  const formatMoney = (amount: number | null | undefined, currency: string | null | undefined) => {
    return `${Number(amount ?? 0).toLocaleString('vi-VN')} ${(currency ?? 'VND').toUpperCase()}`;
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Thanh toán của tôi</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">Theo dõi trạng thái thanh toán và thông tin đặt chỗ liên quan.</p>

      {pollingBookingId && (
        <div className="mb-6 p-4 bg-[var(--color-info-soft)] border border-[var(--color-info)] rounded-[var(--radius-sm)] flex items-center gap-3 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--color-info)]" />
          <span>Đang chờ booking #{pollingBookingId} đồng bộ dữ liệu vé...</span>
        </div>
      )}

      {!filtered.length ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <CreditCard className="w-12 h-12 mx-auto text-[var(--color-text-muted)] opacity-30 mb-4" />
          <h3 className="text-lg font-semibold">Chưa có giao dịch thanh toán</h3>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(p => (
            <div key={p.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-5 hover:shadow-sm transition-all">
              {(() => {
                const booking = myBookings.find(b => b.id === p.bookingId);
                const passenger = passengers.find(x => x.id === p.passengerId);
                const flight = flights.find(f => f.id === p.flightId);
                const bookingStatus = (booking?.status ?? '').toUpperCase();
                const canActOnPayment = (p.status ?? '').toUpperCase() === 'PENDING' && bookingStatus === 'PENDING_PAYMENT';
                return (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold">Thanh toán #{p.id}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">{paymentStatusText(p.status)}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-sm text-[var(--color-text-muted)]">
                    <span>Mã booking: <span className="font-medium text-[var(--color-text-main)]">#{p.bookingId}</span></span>
                    <span>Trạng thái booking: <span className="font-medium text-[var(--color-text-main)]">{bookingStatusText(booking?.status)}</span></span>
                    <span>Chuyến bay: <span className="font-medium text-[var(--color-text-main)]">{flight?.flightNumber || `#${p.flightId}`}</span></span>
                    <span>Ghế: <span className="font-medium text-[var(--color-text-main)]">{p.seatNumber || booking?.seatNumber || 'Chưa có'}</span></span>
                    <span>Số tiền: <span className="font-medium text-[var(--color-text-main)]">{formatMoney(p.amount, p.currency)}</span></span>
                    <span>Hành khách: <span className="font-medium text-[var(--color-text-main)]">{passenger?.fullName || `#${p.passengerId}`}</span></span>
                    <span>Số hộ chiếu: <span className="font-medium text-[var(--color-text-main)]">{passenger?.passportNumber || 'Chưa cập nhật'}</span></span>
                    <span>Thanh toán lúc: <span className="font-medium text-[var(--color-text-main)]">{p.paidAt ? new Date(p.paidAt).toLocaleString('vi-VN') : 'Chưa thanh toán'}</span></span>
                  </div>
                </div>
                {canActOnPayment && (
                  <div className="flex gap-2">
                    <Button onClick={() => setAction({ id: p.id, type: 'success', bookingId: p.bookingId })} className="gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Xác nhận đã thanh toán
                    </Button>
                    <Button variant="ghost" onClick={() => setAction({ id: p.id, type: 'fail', bookingId: p.bookingId })} className="gap-1.5 text-[var(--color-danger)]">
                      <XCircle className="w-4 h-4" /> Đánh dấu thất bại
                    </Button>
                  </div>
                )}
              </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={action !== null}
        onClose={() => setAction(null)}
        onConfirm={() => {
          if (!action) return;
          if (action.type === 'success') successMut.mutate(action.id);
          else failMut.mutate(action.id);
        }}
        title={action?.type === 'success' ? 'Xác nhận thanh toán' : 'Đánh dấu thanh toán thất bại'}
        message={action?.type === 'success' ? 'Bạn muốn cập nhật giao dịch này thành PAID và gửi sự kiện?' : 'Bạn muốn cập nhật giao dịch này thành FAILED và gửi sự kiện?'}
        confirmText={action?.type === 'success' ? 'Xác nhận' : 'Đánh dấu thất bại'}
        variant={action?.type === 'fail' ? 'danger' : undefined}
        loading={successMut.isPending || failMut.isPending}
      />
    </div>
  );
}

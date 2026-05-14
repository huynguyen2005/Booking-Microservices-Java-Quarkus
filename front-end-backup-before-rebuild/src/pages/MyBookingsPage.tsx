import { useQuery } from '@tanstack/react-query';
import { bookingApi, paymentApi, Booking, Payment } from '../api/endpoints';
import { Ticket, CreditCard, Plane } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Link, useNavigate } from 'react-router-dom';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { data: bookings, isLoading } = useQuery<Booking[]>({ queryKey: ['myBookings'], queryFn: bookingApi.getMyBookings });
  const { data: payments } = useQuery<Payment[]>({ queryKey: ['myPayments'], queryFn: paymentApi.getMyPayments });

  const getPaymentForBooking = (bookingId: number) => payments?.find(p => p.bookingId === bookingId);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-main)]">Lịch sử đặt chỗ của tôi</h2>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-sm">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={4} cols={5} /></div>
        ) : bookings && bookings.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]">
            {bookings.map(b => {
              const payment = getPaymentForBooking(b.id);
              return (
                <div key={b.id} className="p-5 hover:bg-[var(--color-surface-subtle)] transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center shrink-0">
                        <Plane className="w-5 h-5 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <p className="font-bold text-[var(--color-text-main)]">Mã Booking: BKG-{b.id}</p>
                        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Chuyến bay: FL-{b.flightId} • Ghế: <span className="font-semibold text-[var(--color-text-main)]">{b.seatNumber}</span></p>
                        <p className="text-xs text-[var(--color-text-muted)]">Hành khách ID: PSG-{b.passengerId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={b.status} />
                      {payment && (
                        <Button
                          size="sm"
                          variant={payment.status === 'PENDING' ? 'default' : 'outline'}
                          className="gap-1.5"
                          onClick={() => navigate('/my-payments')}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          {payment.status === 'PENDING' ? 'Thanh toán' : `PAY-${payment.id}`}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Ticket className="w-12 h-12" />}
            title="Chưa có đặt chỗ nào"
            description="Bạn chưa thực hiện chuyến bay nào."
            action={<Link to="/flights"><Button variant="outline">Tìm chuyến bay ngay</Button></Link>}
          />
        )}
      </div>
    </div>
  );
}

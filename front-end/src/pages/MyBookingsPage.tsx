import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bookingApi, Booking } from '../api/endpoints';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Ticket, CreditCard, Loader2, Plane } from 'lucide-react';

export default function MyBookingsPage() {
  const { data: bookings, isLoading } = useQuery<Booking[]>({ queryKey: ['myBookings'], queryFn: bookingApi.getMyBookings });

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Đặt chỗ của tôi</h1>

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
          {bookings.map(b => (
            <div key={b.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-5 hover:shadow-sm transition-all">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-[var(--color-text-main)]">Booking #{b.id}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="flex gap-4 text-sm text-[var(--color-text-muted)]">
                    <span>Flight #{b.flightId}</span>
                    <span>Ghế: <span className="font-mono font-bold">{b.seatNumber}</span></span>
                    <span>Passenger #{b.passengerId}</span>
                  </div>
                </div>
                <Link to={`/my-payments?bookingId=${b.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline">
                  <CreditCard className="w-4 h-4" /> Xem thanh toán
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { Users, PlaneTakeoff, Ticket, CreditCard, MapPin, Plane, Armchair, UserCheck, BookOpen, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi, DashboardSummary } from '../../api/endpoints';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery<DashboardSummary>({
    queryKey: ['dashboardSummary'],
    queryFn: adminApi.getSummary
  });

  if (isLoading) return <div className="animate-fade-in"><CardSkeleton count={8} /></div>;
  if (isError) return <div className="p-8 text-[var(--color-danger)] text-center">Lỗi khi tải dữ liệu. Vui lòng thử lại.</div>;
  if (!data) return null;

  const cards = [
    { label: 'Người dùng', value: data.usersTotal, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Admin', value: data.adminUsersTotal, icon: UserCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Sân bay', value: data.airportsTotal, icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Máy bay', value: data.airplanesTotal, icon: Plane, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: 'Chuyến bay', value: data.flightsTotal, icon: PlaneTakeoff, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Ghế ngồi', value: data.seatsTotal, icon: Armchair, color: 'text-teal-500', bg: 'bg-teal-50' },
    { label: 'Hành khách', value: data.passengersTotal, icon: UserCheck, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { label: 'Đặt chỗ', value: data.bookingsTotal, icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Tổng quan hệ thống</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Báo cáo số liệu thực thời về hoạt động bán vé và chuyến bay.</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-[var(--radius-md)] shadow-sm hover:shadow-[var(--shadow-md)] transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{c.label}</span>
              <div className={`w-9 h-9 rounded-[var(--radius-sm)] ${c.bg} flex items-center justify-center`}>
                <c.icon className={`w-4 h-4 ${c.color}`} />
              </div>
            </div>
            <span className="text-3xl font-bold text-[var(--color-text-main)]">{c.value}</span>
          </div>
        ))}
      </div>

      {/* Detail panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment status */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-[var(--radius-md)] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-[var(--color-text-muted)]" />
            <h4 className="font-semibold text-sm text-[var(--color-text-muted)]">Trạng thái thanh toán</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-text-main)]">Đã thanh toán</span>
              <span className="font-bold text-[var(--color-success)]">{data.paidPaymentsTotal}</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-surface-subtle)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-success)] rounded-full" style={{width: `${data.paymentsTotal ? (data.paidPaymentsTotal / data.paymentsTotal * 100) : 0}%`}} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-text-main)]">Chờ xử lý</span>
              <span className="font-bold text-[var(--color-warning)]">{data.pendingPaymentsTotal}</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-surface-subtle)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-warning)] rounded-full" style={{width: `${data.paymentsTotal ? (data.pendingPaymentsTotal / data.paymentsTotal * 100) : 0}%`}} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-text-main)]">Thất bại</span>
              <span className="font-bold text-[var(--color-danger)]">{data.failedPaymentsTotal}</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-surface-subtle)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-danger)] rounded-full" style={{width: `${data.paymentsTotal ? (data.failedPaymentsTotal / data.paymentsTotal * 100) : 0}%`}} />
            </div>
          </div>
        </div>

        {/* Tickets & Checkins */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-[var(--radius-md)] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Ticket className="w-4 h-4 text-[var(--color-text-muted)]" />
            <h4 className="font-semibold text-sm text-[var(--color-text-muted)]">Vé & Check-in</h4>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
              <span className="text-sm text-[var(--color-text-main)]">Tổng vé phát hành</span>
              <span className="font-bold text-[var(--color-text-main)]">{data.ticketsTotal}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
              <span className="text-sm text-[var(--color-text-main)]">Tổng check-in</span>
              <span className="font-bold text-[var(--color-text-main)]">{data.checkinsTotal}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-[var(--color-text-main)]">Tỉ lệ check-in</span>
              <span className="font-bold text-[var(--color-primary)]">
                {data.ticketsTotal ? Math.round(data.checkinsTotal / data.ticketsTotal * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-[var(--radius-md)] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[var(--color-text-muted)]" />
            <h4 className="font-semibold text-sm text-[var(--color-text-muted)]">Cơ sở hạ tầng</h4>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
              <span className="text-sm text-[var(--color-text-main)]">Sân bay</span>
              <span className="font-bold text-[var(--color-text-main)]">{data.airportsTotal}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
              <span className="text-sm text-[var(--color-text-main)]">Máy bay</span>
              <span className="font-bold text-[var(--color-text-main)]">{data.airplanesTotal}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
              <span className="text-sm text-[var(--color-text-main)]">Tổng ghế</span>
              <span className="font-bold text-[var(--color-text-main)]">{data.seatsTotal}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-[var(--color-text-main)]">Tổng thanh toán</span>
              <span className="font-bold text-[var(--color-text-main)]">{data.paymentsTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

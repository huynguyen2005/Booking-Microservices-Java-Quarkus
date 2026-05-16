import { useQuery } from '@tanstack/react-query';
import { adminApi, DashboardSummary } from '../../api/endpoints';
import { Loader2, Users, Plane, MapPin, Armchair, UserCheck, Ticket, CreditCard, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { data: summary, isLoading } = useQuery<DashboardSummary>({ queryKey: ['adminDashboard'], queryFn: adminApi.getSummary });

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>;
  if (!summary) return <div className="text-center py-20 text-[var(--color-text-muted)]">Không tải được dữ liệu.</div>;

  const stats = [
    { label: 'Người dùng', value: summary.usersTotal, icon: Users, color: 'text-blue-500' },
    { label: 'Quản trị viên', value: summary.adminUsersTotal, icon: UserCheck, color: 'text-purple-500' },
    { label: 'Sân bay', value: summary.airportsTotal, icon: MapPin, color: 'text-green-500' },
    { label: 'Máy bay', value: summary.airplanesTotal, icon: Plane, color: 'text-cyan-500' },
    { label: 'Chuyến bay', value: summary.flightsTotal, icon: Plane, color: 'text-indigo-500' },
    { label: 'Ghế', value: summary.seatsTotal, icon: Armchair, color: 'text-amber-500' },
    { label: 'Hành khách', value: summary.passengersTotal, icon: Users, color: 'text-teal-500' },
    { label: 'Đặt chỗ', value: summary.bookingsTotal, icon: Ticket, color: 'text-orange-500' },
  ];

  const paidPct = summary.paymentsTotal ? Math.round(summary.paidPaymentsTotal / summary.paymentsTotal * 100) : 0;
  const pendPct = summary.paymentsTotal ? Math.round(summary.pendingPaymentsTotal / summary.paymentsTotal * 100) : 0;
  const failPct = summary.paymentsTotal ? Math.round(summary.failedPaymentsTotal / summary.paymentsTotal * 100) : 0;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Tổng quan</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">{s.label}</span>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text-main)]">{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Thanh toán ({summary.paymentsTotal})</h3>
          <div className="space-y-3">
            <div><div className="flex justify-between text-sm mb-1"><span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-[var(--color-success)]" /> Đã thanh toán</span><span className="font-bold">{summary.paidPaymentsTotal} ({paidPct}%)</span></div><div className="h-2 bg-[var(--color-surface-subtle)] rounded-full overflow-hidden"><div className="h-full bg-[var(--color-success)] rounded-full" style={{ width: `${paidPct}%` }} /></div></div>
            <div><div className="flex justify-between text-sm mb-1"><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[var(--color-warning)]" /> Chờ thanh toán</span><span className="font-bold">{summary.pendingPaymentsTotal} ({pendPct}%)</span></div><div className="h-2 bg-[var(--color-surface-subtle)] rounded-full overflow-hidden"><div className="h-full bg-[var(--color-warning)] rounded-full" style={{ width: `${pendPct}%` }} /></div></div>
            <div><div className="flex justify-between text-sm mb-1"><span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-[var(--color-danger)]" /> Thanh toán thất bại</span><span className="font-bold">{summary.failedPaymentsTotal} ({failPct}%)</span></div><div className="h-2 bg-[var(--color-surface-subtle)] rounded-full overflow-hidden"><div className="h-full bg-[var(--color-danger)] rounded-full" style={{ width: `${failPct}%` }} /></div></div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Ticket className="w-4 h-4" /> Vé & Check-in</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-[var(--color-surface-subtle)] rounded-md"><p className="text-3xl font-bold text-[var(--color-text-main)]">{summary.ticketsTotal}</p><p className="text-xs text-[var(--color-text-muted)] mt-1">Vé đã xuất</p></div>
            <div className="text-center p-4 bg-[var(--color-surface-subtle)] rounded-md"><p className="text-3xl font-bold text-[var(--color-text-main)]">{summary.checkinsTotal}</p><p className="text-xs text-[var(--color-text-muted)] mt-1">Lượt check-in</p></div>
          </div>
          {summary.ticketsTotal > 0 && <div className="mt-3 text-xs text-[var(--color-text-muted)]">Tỷ lệ check-in: <span className="font-bold">{Math.round(summary.checkinsTotal / summary.ticketsTotal * 100)}%</span></div>}
        </div>
      </div>
    </div>
  );
}

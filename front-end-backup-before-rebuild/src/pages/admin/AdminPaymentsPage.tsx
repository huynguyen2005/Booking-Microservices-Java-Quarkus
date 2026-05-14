import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi, Payment } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { CreditCard, XCircle, CheckCircle } from 'lucide-react';

export default function AdminPaymentsPage() {
  const queryClient = useQueryClient();
  const { data: payments, isLoading } = useQuery<Payment[]>({ queryKey: ['adminPayments'], queryFn: paymentApi.getAllPayments });
  const [confirmAction, setConfirmAction] = useState<{ id: number; type: 'pay' | 'fail' } | null>(null);

  const payMut = useMutation({
    mutationFn: (id: number) => paymentApi.pay(id),
    onSuccess: () => { toast.success('Đã thanh toán thành công!'); setConfirmAction(null); queryClient.invalidateQueries({ queryKey: ['adminPayments'] }); },
    onError: (e: any) => { toast.error(e.response?.data?.message || 'Lỗi'); setConfirmAction(null); }
  });

  const failMut = useMutation({
    mutationFn: (id: number) => paymentApi.fail(id),
    onSuccess: () => { toast.success('Đã đánh dấu thất bại!'); setConfirmAction(null); queryClient.invalidateQueries({ queryKey: ['adminPayments'] }); },
    onError: (e: any) => { toast.error(e.response?.data?.message || 'Lỗi'); setConfirmAction(null); }
  });

  const columns: Column<Payment>[] = [
    { key: 'id', header: 'Mã GD', render: p => <span className="font-bold text-[var(--color-text-main)]">PAY-{p.id}</span> },
    { key: 'bookingId', header: 'Booking', render: p => `BKG-${p.bookingId}` },
    { key: 'userId', header: 'User ID' },
    { key: 'status', header: 'Trạng thái', render: p => <StatusBadge status={p.status} /> },
    { key: '_actions', header: 'Hành động', sortable: false, render: p => (
      p.status === 'PENDING' ? (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setConfirmAction({ id: p.id, type: 'pay' })} className="gap-1"><CheckCircle className="w-3.5 h-3.5" /> Thanh toán</Button>
          <Button size="sm" variant="destructive" onClick={() => setConfirmAction({ id: p.id, type: 'fail' })} className="gap-1"><XCircle className="w-3.5 h-3.5" /> Thất bại</Button>
        </div>
      ) : <span className="text-xs text-[var(--color-text-muted)]">—</span>
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Thanh toán</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <CreditCard className="w-4 h-4" />
            Tổng: <span className="font-bold text-[var(--color-text-main)]">{payments?.length ?? 0}</span>
          </div>
        </div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={6} cols={5} /></div> : <DataTable columns={columns} data={payments ?? []} pageSize={10} />}
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.type === 'pay') payMut.mutate(confirmAction.id);
          else failMut.mutate(confirmAction.id);
        }}
        title={confirmAction?.type === 'pay' ? 'Xác nhận thanh toán' : 'Đánh dấu thất bại'}
        message={confirmAction?.type === 'pay' ? 'Xác nhận giao dịch này đã thanh toán thành công?' : 'Đánh dấu giao dịch này là thất bại?'}
        confirmText={confirmAction?.type === 'pay' ? 'Thanh toán' : 'Đánh dấu thất bại'}
        variant={confirmAction?.type === 'pay' ? 'primary' : 'danger'}
        loading={payMut.isPending || failMut.isPending}
      />
    </div>
  );
}

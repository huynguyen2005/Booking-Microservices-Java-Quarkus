import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi, Payment } from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AdminPaymentsPage() {
  const qc = useQueryClient();
  const [paymentId, setPaymentId] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [status, setStatus] = useState('');

  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ['adminPayments', paymentId, bookingId, status],
    queryFn: () => paymentApi.search({ paymentId: paymentId ? Number(paymentId) : undefined, bookingId: bookingId ? Number(bookingId) : undefined, status: status || undefined }),
  });

  const [action, setAction] = useState<{ id: number; type: 'pay' | 'fail' } | null>(null);

  const payMut = useMutation({ mutationFn: paymentApi.pay, onSuccess: () => { toast.success('Ðã dánh d?u PAID'); setAction(null); qc.invalidateQueries({ queryKey: ['adminPayments'] }); }, onError: (e: any) => { toast.error(e.response?.data?.message || e.response?.data || 'Có l?i x?y ra'); setAction(null); } });
  const failMut = useMutation({ mutationFn: paymentApi.fail, onSuccess: () => { toast.success('Ðã dánh d?u FAILED'); setAction(null); qc.invalidateQueries({ queryKey: ['adminPayments'] }); }, onError: (e: any) => { toast.error(e.response?.data?.message || e.response?.data || 'Có l?i x?y ra'); setAction(null); } });

  const columns: Column<Payment>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'User ID' },
    { key: 'bookingId', header: 'Booking ID' },
    { key: 'passengerId', header: 'Passenger ID' },
    { key: 'flightId', header: 'Flight ID' },
    { key: 'status', header: 'Tr?ng thái', render: p => <StatusBadge status={p.status} /> },
    { key: '_actions', header: '', sortable: false, render: p => (p.status ?? '').toUpperCase() === 'PENDING' ? (
      <div className="flex gap-1 justify-end">
        <Button size="sm" variant="ghost" onClick={() => setAction({ id: p.id, type: 'pay' })} className="text-[var(--color-success)]"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Pay</Button>
        <Button size="sm" variant="ghost" onClick={() => setAction({ id: p.id, type: 'fail' })} className="text-[var(--color-danger)]"><XCircle className="w-3.5 h-3.5 mr-1" /> Fail</Button>
      </div>
    ) : null },
  ], []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Qu?n lý thanh toán</h1>
      <div className="grid md:grid-cols-3 gap-2 mb-4">
        <input placeholder="Payment ID" value={paymentId} onChange={e => setPaymentId(e.target.value)} />
        <input placeholder="Booking ID" value={bookingId} onChange={e => setBookingId(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">T?t c? tr?ng thái</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="FAILED">FAILED</option>
        </select>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={7} /></div> : <DataTable columns={columns} data={payments ?? []} pageSize={10} />}
      </div>
      <ConfirmDialog open={action !== null} onClose={() => setAction(null)} onConfirm={() => { if (action?.type === 'pay') payMut.mutate(action.id); else if (action?.type === 'fail') failMut.mutate(action.id); }} title={action?.type === 'pay' ? 'Xác nh?n thanh toán' : 'Ðánh d?u th?t b?i'} message={action?.type === 'pay' ? 'Ðánh d?u payment là PAID?' : 'Ðánh d?u payment là FAILED?'} confirmText={action?.type === 'pay' ? 'Pay' : 'Fail'} variant={action?.type === 'fail' ? 'danger' : undefined} loading={payMut.isPending || failMut.isPending} />
    </div>
  );
}


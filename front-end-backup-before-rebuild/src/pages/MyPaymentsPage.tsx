import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi, ticketApi, Payment } from '../api/endpoints';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';
import { CreditCard } from 'lucide-react';
import { useState, useCallback } from 'react';

export default function MyPaymentsPage() {
  const queryClient = useQueryClient();
  const { data: payments, isLoading } = useQuery<Payment[]>({ queryKey: ['myPayments'], queryFn: paymentApi.getMyPayments });
  const [confirmPayId, setConfirmPayId] = useState<number | null>(null);

  // Ticket polling after successful payment
  const pollTicket = useCallback(async (bookingId: number) => {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = 1500; // 1.5 seconds
    
    const poll = async (): Promise<void> => {
      attempts++;
      try {
        const tickets = await ticketApi.getByBooking(bookingId);
        if (tickets && tickets.length > 0) {
          toast.success(`Vé đã được xuất! Mã vé: ${tickets[0].ticketCode}`);
          queryClient.invalidateQueries({ queryKey: ['myTickets'] });
          return;
        }
      } catch { /* ignore errors during polling */ }

      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, interval));
        return poll();
      } else {
        toast('Vé đang được xử lý. Vui lòng kiểm tra mục "Vé máy bay" sau ít phút.', { icon: '⏳' });
      }
    };

    return poll();
  }, [queryClient]);

  const payMutation = useMutation({
    mutationFn: (id: number) => paymentApi.pay(id),
    onSuccess: (_data, _id) => {
      toast.success('Thanh toán thành công! Đang tìm vé...');
      queryClient.invalidateQueries({ queryKey: ['myPayments'] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      setConfirmPayId(null);
      
      // Find booking ID to poll for ticket
      const payment = payments?.find(p => p.id === _id);
      if (payment) {
        pollTicket(payment.bookingId);
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.response?.data || 'Thanh toán thất bại.');
      setConfirmPayId(null);
    }
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-text-main)]">Lịch sử giao dịch</h1>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={4} cols={4} /></div>
        ) : payments && payments.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Mã giao dịch</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Mã Booking</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Trạng thái</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                  <td className="px-5 py-3.5 font-medium text-[var(--color-text-main)]">PAY-{p.id}</td>
                  <td className="px-5 py-3.5 text-[var(--color-text-muted)]">BKG-{p.bookingId}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3.5">
                    {p.status === 'PENDING' && (
                      <Button 
                        size="sm" 
                        onClick={() => setConfirmPayId(p.id)}
                        disabled={payMutation.isPending}
                        className="gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Thanh toán ngay
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon={<CreditCard className="w-12 h-12" />}
            title="Chưa có giao dịch nào"
            description="Bạn chưa có giao dịch thanh toán nào."
          />
        )}
      </div>

      <ConfirmDialog
        open={confirmPayId !== null}
        onClose={() => setConfirmPayId(null)}
        onConfirm={() => confirmPayId && payMutation.mutate(confirmPayId)}
        title="Xác nhận thanh toán"
        message="Bạn có chắc chắn muốn thanh toán giao dịch này?"
        confirmText="Thanh toán"
        variant="primary"
        loading={payMutation.isPending}
      />
    </div>
  );
}

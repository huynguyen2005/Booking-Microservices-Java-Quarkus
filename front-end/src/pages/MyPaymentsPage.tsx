import { useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { paymentApi, ticketApi, Payment } from '../api/endpoints';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';
import { CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function MyPaymentsPage() {
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { data: payments, isLoading } = useQuery<Payment[]>({ queryKey: ['myPayments'], queryFn: paymentApi.getMyPayments });

  const [payId, setPayId] = useState<number | null>(null);
  const [polling, setPolling] = useState(false);
  const pollCount = useRef(0);

  const payMut = useMutation({
    mutationFn: paymentApi.pay,
    onSuccess: () => {
      toast.success('Thanh toán thành công! Đang phát hành vé...');
      setPayId(null);
      qc.invalidateQueries({ queryKey: ['myPayments'] });
      // Start polling for ticket
      setPolling(true);
      pollCount.current = 0;
    },
    onError: (e: any) => { toast.error(e.response?.data?.message || e.response?.data || 'Thanh toán thất bại'); setPayId(null); },
  });

  const pollTickets = useCallback(() => {
    if (pollCount.current >= 10) { setPolling(false); toast.info('Vé đang được xử lý. Kiểm tra lại sau.'); return; }
    pollCount.current += 1;
    ticketApi.getMyTickets().then(() => { qc.invalidateQueries({ queryKey: ['myTickets'] }); setPolling(false); toast.success('Vé đã được phát hành! Xem tại Vé của tôi.'); }).catch(() => {});
  }, [qc]);

  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(pollTickets, 2000);
    return () => clearInterval(interval);
  }, [polling, pollTickets]);

  const filtered = bookingId ? payments?.filter(p => p.bookingId === Number(bookingId)) : payments;

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Thanh toán của tôi</h1>

      {polling && (
        <div className="mb-6 p-4 bg-[var(--color-info-soft)] border border-[var(--color-info)] rounded-[var(--radius-sm)] flex items-center gap-3 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--color-info)]" />
          <span>Đang phát hành vé... Vui lòng chờ.</span>
        </div>
      )}

      {!filtered || filtered.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <CreditCard className="w-12 h-12 mx-auto text-[var(--color-text-muted)] opacity-30 mb-4" />
          <h3 className="text-lg font-semibold">Chưa có thanh toán</h3>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(p => (
            <div key={p.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-5 hover:shadow-sm transition-all">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold">Payment #{p.id}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex gap-4 text-sm text-[var(--color-text-muted)]">
                    <span>Booking #{p.bookingId}</span>
                    <span>Flight #{p.flightId}</span>
                  </div>
                </div>
                {p.status === 'PENDING' && (
                  <Button onClick={() => setPayId(p.id)} className="gap-1.5"><CheckCircle className="w-4 h-4" /> Thanh toán</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={payId !== null} onClose={() => setPayId(null)} onConfirm={() => payId && payMut.mutate(payId)} title="Thanh toán" message="Xác nhận thanh toán?" confirmText="Thanh toán" loading={payMut.isPending} />
    </div>
  );
}

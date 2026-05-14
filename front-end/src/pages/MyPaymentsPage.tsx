import { useEffect, useRef, useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { paymentApi, ticketApi, Payment } from '../api/endpoints';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function MyPaymentsPage() {
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { data: payments, isLoading } = useQuery<Payment[]>({ queryKey: ['myPayments'], queryFn: paymentApi.getMyPayments });

  const [action, setAction] = useState<{ id: number; type: 'success' | 'fail' } | null>(null);
  const [polling, setPolling] = useState(false);
  const pollCount = useRef(0);

  const successMut = useMutation({
    mutationFn: paymentApi.simulateSuccess,
    onSuccess: () => {
      toast.success('Simulated success payment. Issuing ticket...');
      setAction(null);
      qc.invalidateQueries({ queryKey: ['myPayments'] });
      setPolling(true);
      pollCount.current = 0;
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || e.response?.data || 'Simulate success failed');
      setAction(null);
    },
  });

  const failMut = useMutation({
    mutationFn: paymentApi.simulateFail,
    onSuccess: () => {
      toast.info('Simulated failed payment.');
      setAction(null);
      qc.invalidateQueries({ queryKey: ['myPayments'] });
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || e.response?.data || 'Simulate fail failed');
      setAction(null);
    },
  });

  const pollTickets = useCallback(() => {
    if (pollCount.current >= 10) {
      setPolling(false);
      toast.info('Ticket is still processing. Check again later.');
      return;
    }
    pollCount.current += 1;
    ticketApi.getMyTickets()
      .then(() => {
        qc.invalidateQueries({ queryKey: ['myTickets'] });
        setPolling(false);
        toast.success('Ticket issued successfully.');
      })
      .catch(() => {});
  }, [qc]);

  useEffect(() => {
    if (!polling) {
      return;
    }
    const interval = setInterval(pollTickets, 2000);
    return () => clearInterval(interval);
  }, [polling, pollTickets]);

  const filtered = bookingId ? payments?.filter(p => p.bookingId === Number(bookingId)) : payments;

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">My Payments</h1>

      {polling && (
        <div className="mb-6 p-4 bg-[var(--color-info-soft)] border border-[var(--color-info)] rounded-[var(--radius-sm)] flex items-center gap-3 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--color-info)]" />
          <span>Issuing ticket... Please wait.</span>
        </div>
      )}

      {!filtered || filtered.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <CreditCard className="w-12 h-12 mx-auto text-[var(--color-text-muted)] opacity-30 mb-4" />
          <h3 className="text-lg font-semibold">No payment yet</h3>
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
                  <div className="flex gap-2">
                    <Button onClick={() => setAction({ id: p.id, type: 'success' })} className="gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Simulate Success
                    </Button>
                    <Button variant="ghost" onClick={() => setAction({ id: p.id, type: 'fail' })} className="gap-1.5 text-[var(--color-danger)]">
                      <XCircle className="w-4 h-4" /> Simulate Fail
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={action !== null}
        onClose={() => setAction(null)}
        onConfirm={() => {
          if (!action) {
            return;
          }
          if (action.type === 'success') {
            successMut.mutate(action.id);
          } else {
            failMut.mutate(action.id);
          }
        }}
        title={action?.type === 'success' ? 'Simulate success' : 'Simulate fail'}
        message={action?.type === 'success' ? 'Mark this payment as PAID and emit event?' : 'Mark this payment as FAILED and emit event?'}
        confirmText={action?.type === 'success' ? 'Success' : 'Fail'}
        variant={action?.type === 'fail' ? 'danger' : undefined}
        loading={successMut.isPending || failMut.isPending}
      />
    </div>
  );
}

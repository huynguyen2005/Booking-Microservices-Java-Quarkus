import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkinApi, Checkin } from '../api/endpoints';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';
import { ClipboardCheck, Loader2, Search } from 'lucide-react';

export default function CheckinPage() {
  const qc = useQueryClient();
  const [ticketCode, setTicketCode] = useState('');
  const { data: checkins, isLoading } = useQuery<Checkin[]>({ queryKey: ['myCheckins'], queryFn: checkinApi.getMyCheckins });

  const checkinMut = useMutation({
    mutationFn: () => checkinApi.createCheckin(ticketCode.trim()),
    onSuccess: () => { toast.success('Check-in thành công!'); setTicketCode(''); qc.invalidateQueries({ queryKey: ['myCheckins'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Check-in thất bại'),
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Check-in</h1>

      {/* Check-in form */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-[var(--color-primary)]" /> Check-in với mã vé</h2>
        <div className="flex gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" /><input className="pl-9" placeholder="Nhập mã vé (VD: TCK-20260509-ABCD)" value={ticketCode} onChange={e => setTicketCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && checkinMut.mutate()} /></div>
          <Button onClick={() => checkinMut.mutate()} disabled={!ticketCode.trim() || checkinMut.isPending} className="gap-1.5">
            {checkinMut.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Check-in
          </Button>
        </div>
      </div>

      {/* History */}
      <h2 className="text-lg font-semibold mb-4">Lịch sử check-in</h2>
      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" /></div>
      ) : !checkins || checkins.length === 0 ? (
        <div className="text-center py-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <ClipboardCheck className="w-10 h-10 mx-auto text-[var(--color-text-muted)] opacity-30 mb-3" />
          <p className="text-sm text-[var(--color-text-muted)]">Chưa có check-in nào.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {checkins.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-sm">{c.ticketCode}</span>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">Booking #{c.bookingId} • Flight #{c.flightId}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi, checkinApi, Checkin } from '../api/endpoints';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { toast } from '../components/ui/Toast';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Search, CheckCircle, Plane } from 'lucide-react';

export default function CheckinPage() {
  const queryClient = useQueryClient();
  const [ticketCode, setTicketCode] = useState('');
  const [searchedCode, setSearchedCode] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: ticket, isLoading, isError } = useQuery({
    queryKey: ['ticketByCode', searchedCode],
    queryFn: () => ticketApi.getByCode(searchedCode),
    enabled: !!searchedCode,
    retry: false
  });

  const { data: myCheckins, isLoading: loadingCheckins } = useQuery<Checkin[]>({
    queryKey: ['myCheckins'],
    queryFn: checkinApi.getMyCheckins
  });

  const checkinMutation = useMutation({
    mutationFn: () => checkinApi.createCheckin(ticket!.ticketCode),
    onSuccess: () => {
      toast.success('Check-in thành công! Chúc bạn có chuyến bay vui vẻ.');
      queryClient.invalidateQueries({ queryKey: ['ticketByCode', searchedCode] });
      queryClient.invalidateQueries({ queryKey: ['myCheckins'] });
      setShowConfirm(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.response?.data || 'Lỗi check-in');
      setShowConfirm(false);
    }
  });

  const handleSearch = () => {
    if (!ticketCode.trim()) {
      toast.error('Vui lòng nhập mã vé.');
      return;
    }
    setSearchedCode(ticketCode.trim().toUpperCase());
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      {/* Check-in form */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-sm p-8 text-center mb-12 max-w-xl mx-auto">
        <div className="h-16 w-16 rounded-full bg-[var(--color-success-soft)] flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[var(--color-success)]" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-main)]">Check-in Trực tuyến</h1>
        <p className="text-[var(--color-text-muted)] mb-8">Nhập mã vé điện tử của bạn để làm thủ tục bay.</p>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-4 w-4 h-4 text-[var(--color-text-muted)]" />
            <input 
              type="text" 
              placeholder="Mã vé (Ticket Code)" 
              className="w-full h-12 pl-9 pr-4 border border-[var(--color-border)] rounded-[var(--radius-sm)] uppercase text-lg font-medium"
              value={ticketCode}
              onChange={e => setTicketCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={!ticketCode || isLoading} className="h-12 px-6">
            {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
          </Button>
        </div>

        {isError && (
          <div className="mt-6 p-3 bg-[var(--color-danger-soft)] text-[var(--color-danger)] rounded-[var(--radius-sm)] text-sm">
            Không tìm thấy vé hợp lệ với mã <strong>{searchedCode}</strong>.
          </div>
        )}

        {ticket && (
          <div className="mt-8 p-6 bg-[var(--color-primary-soft)] border border-[var(--color-primary)] rounded-[var(--radius-md)] text-left animate-slide-up">
            <h3 className="text-xl font-bold mb-4 text-[var(--color-text-main)]">Thông tin vé</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-[var(--color-text-muted)]">Mã vé:</span>
                <p className="font-bold text-[var(--color-primary)]">{ticket.ticketCode}</p>
              </div>
              <div>
                <span className="text-[var(--color-text-muted)]">Ghế:</span>
                <p className="font-bold text-[var(--color-text-main)]">{ticket.seatNumber}</p>
              </div>
              <div>
                <span className="text-[var(--color-text-muted)]">Chuyến bay:</span>
                <p className="font-bold text-[var(--color-text-main)]">FL-{ticket.flightId}</p>
              </div>
              <div>
                <span className="text-[var(--color-text-muted)]">Trạng thái:</span>
                <div className="mt-1"><StatusBadge status={ticket.status} /></div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-6"
              onClick={() => setShowConfirm(true)}
              disabled={checkinMutation.isPending || ticket.status === 'CHECKED_IN'}
            >
              {ticket.status === 'CHECKED_IN' ? '✓ Đã check-in' : 'Tiến hành Check-in'}
            </Button>
          </div>
        )}
      </div>

      {/* Check-in history */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-sm overflow-hidden">
        <h2 className="text-xl font-bold p-6 border-b border-[var(--color-border)] text-[var(--color-text-main)]">Lịch sử Check-in của bạn</h2>
        {loadingCheckins ? (
          <div className="p-6"><TableSkeleton rows={3} cols={4} /></div>
        ) : myCheckins && myCheckins.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Mã Check-in</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Mã Vé</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Chuyến bay</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {myCheckins.map(c => (
                <tr key={c.id} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                  <td className="px-5 py-3.5 font-medium text-[var(--color-text-main)]">CHK-{c.id}</td>
                  <td className="px-5 py-3.5 text-[var(--color-primary)] font-medium">{c.ticketCode}</td>
                  <td className="px-5 py-3.5 text-[var(--color-text-muted)]">FL-{c.flightId}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon={<Plane className="w-12 h-12" />}
            title="Chưa có check-in nào"
            description="Bạn chưa có lịch sử check-in."
          />
        )}
      </div>

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => checkinMutation.mutate()}
        title="Xác nhận Check-in"
        message={`Bạn có chắc chắn muốn check-in vé ${ticket?.ticketCode}?`}
        confirmText="Check-in"
        variant="primary"
        loading={checkinMutation.isPending}
      />
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flightApi, Flight, Seat } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Plus, Armchair } from 'lucide-react';

export default function AdminSeatsPage() {
  const queryClient = useQueryClient();
  const [flightFilter, setFlightFilter] = useState<number | ''>('');
  const { data: seats, isLoading } = useQuery<Seat[]>({ queryKey: ['adminSeats', flightFilter], queryFn: () => flightApi.getSeats(flightFilter || undefined) });
  const { data: flights } = useQuery<Flight[]>({ queryKey: ['flightsList'], queryFn: flightApi.getFlights });

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ flightId: 0, seatNumber: '' });
  const [bookConfirmId, setBookConfirmId] = useState<number | null>(null);

  const createMut = useMutation({ mutationFn: flightApi.createSeat, onSuccess: () => { toast.success('Thêm ghế thành công!'); setModalOpen(false); queryClient.invalidateQueries({ queryKey: ['adminSeats'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Lỗi') });
  const bookMut = useMutation({ mutationFn: (id: number) => flightApi.bookSeat(id), onSuccess: () => { toast.success('Đã đánh dấu ghế đã đặt!'); setBookConfirmId(null); queryClient.invalidateQueries({ queryKey: ['adminSeats'] }); }, onError: (e: any) => { toast.error(e.response?.data?.message || 'Lỗi'); setBookConfirmId(null); } });

  const flightMap = useMemo(() => {
    const m: Record<number, Flight> = {};
    flights?.forEach(f => { m[f.id] = f; });
    return m;
  }, [flights]);

  const columns: Column<Seat>[] = [
    { key: 'id', header: 'ID' },
    { key: 'flightId', header: 'Chuyến bay', render: s => <span className="font-medium">{flightMap[s.flightId]?.flightNumber ?? `FL-${s.flightId}`}</span> },
    { key: 'seatNumber', header: 'Số ghế', render: s => <span className="font-bold text-[var(--color-primary)]">{s.seatNumber}</span> },
    { key: 'booked', header: 'Trạng thái', render: s => (
      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${s.booked ? 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]' : 'bg-[var(--color-success-soft)] text-[var(--color-success)]'}`}>
        {s.booked ? 'ĐÃ ĐẶT' : 'TRỐNG'}
      </span>
    )},
    { key: '_actions', header: '', sortable: false, render: s => (
      !s.booked ? <Button size="sm" variant="outline" onClick={() => setBookConfirmId(s.id)} className="gap-1"><Armchair className="w-3.5 h-3.5" /> Đặt</Button> : <span className="text-xs text-[var(--color-text-muted)]">—</span>
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Ghế ngồi</h1>
        <div className="flex gap-3 items-center">
          <select className="h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm" value={flightFilter} onChange={e => setFlightFilter(e.target.value ? Number(e.target.value) : '')}>
            <option value="">Tất cả chuyến bay</option>
            {flights?.map(f => <option key={f.id} value={f.id}>{f.flightNumber}</option>)}
          </select>
          <Button onClick={() => { setFormData({ flightId: flights?.[0]?.id || 0, seatNumber: '' }); setModalOpen(true); }} className="gap-1.5"><Plus className="w-4 h-4" /> Thêm</Button>
        </div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={8} cols={5} /></div> : <DataTable columns={columns} data={seats ?? []} pageSize={15} />}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Thêm ghế mới">
        <form onSubmit={e => { e.preventDefault(); createMut.mutate(formData); }} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Chuyến bay</label><select required className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.flightId} onChange={e => setFormData({...formData, flightId: Number(e.target.value)})}>{flights?.map(f => <option key={f.id} value={f.id}>{f.flightNumber}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Số ghế (VD: A1)</label><input required className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] uppercase" value={formData.seatNumber} onChange={e => setFormData({...formData, seatNumber: e.target.value.toUpperCase()})} /></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button><Button type="submit" disabled={createMut.isPending}>Lưu</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={bookConfirmId !== null} onClose={() => setBookConfirmId(null)} onConfirm={() => bookConfirmId && bookMut.mutate(bookConfirmId)} title="Đặt ghế" message="Đánh dấu ghế này là đã đặt?" confirmText="Đặt ghế" variant="warning" loading={bookMut.isPending} />
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flightApi, Seat, Flight } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Plus, CheckCircle } from 'lucide-react';

export default function AdminSeatsPage() {
  const qc = useQueryClient();
  const [flightFilter, setFlightFilter] = useState<number | ''>('');
  const { data: flights } = useQuery<Flight[]>({ queryKey: ['flights'], queryFn: flightApi.getFlights });
  const { data: seats, isLoading } = useQuery<Seat[]>({ queryKey: ['adminSeats', flightFilter], queryFn: () => flightApi.getSeats(flightFilter ? Number(flightFilter) : undefined) });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ flightId: 0, seatNumber: '' });
  const [bookId, setBookId] = useState<number | null>(null);

  const flightMap = useMemo(() => {
    const m: Record<number, string> = {};
    flights?.forEach(f => { m[f.id] = f.flightNumber ?? `#${f.id}`; });
    return m;
  }, [flights]);

  const createMut = useMutation({ mutationFn: () => flightApi.createSeat(form), onSuccess: () => { toast.success('Tạo ghế thành công!'); setModalOpen(false); qc.invalidateQueries({ queryKey: ['adminSeats'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Lỗi') });
  const bookMut = useMutation({ mutationFn: (id: number) => flightApi.bookSeat(id), onSuccess: () => { toast.success('Đánh dấu đã đặt!'); setBookId(null); qc.invalidateQueries({ queryKey: ['adminSeats'] }); }, onError: (e: any) => { toast.error(e.response?.data?.message || e.response?.data || 'Lỗi'); setBookId(null); } });

  const openCreate = () => { setForm({ flightId: flights?.[0]?.id || 0, seatNumber: '' }); setModalOpen(true); };

  const columns: Column<Seat>[] = [
    { key: 'id', header: 'ID' },
    { key: 'flightId', header: 'Chuyến bay', render: s => <span className="font-medium">{s.flightId ? (flightMap[s.flightId] ?? `#${s.flightId}`) : '—'}</span> },
    { key: 'seatNumber', header: 'Số ghế', render: s => <span className="font-mono font-bold">{s.seatNumber ?? '—'}</span> },
    { key: 'booked', header: 'Trạng thái', render: s => s.booked
      ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-danger-soft)] text-[var(--color-danger)]">Đã đặt</span>
      : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-success-soft)] text-[var(--color-success)]">Còn trống</span>
    },
    { key: '_actions', header: '', sortable: false, render: s => !s.booked ? (
      <Button size="sm" variant="ghost" onClick={() => setBookId(s.id)} className="text-[var(--color-primary)]"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Book</Button>
    ) : null }
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Ghế ngồi</h1>
        <div className="flex items-center gap-3">
          <select className="text-sm" value={flightFilter} onChange={e => setFlightFilter(e.target.value ? Number(e.target.value) : '')}>
            <option value="">Tất cả chuyến</option>
            {flights?.map(f => <option key={f.id} value={f.id}>{f.flightNumber ?? `Flight #${f.id}`}</option>)}
          </select>
          <Button onClick={openCreate} className="gap-1.5"><Plus className="w-4 h-4" /> Thêm</Button>
        </div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={5} /></div> : <DataTable columns={columns} data={seats ?? []} pageSize={15} />}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tạo ghế mới">
        <form onSubmit={e => { e.preventDefault(); createMut.mutate(); }} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Chuyến bay</label><select value={form.flightId} onChange={e => setForm({ ...form, flightId: Number(e.target.value) })}>{flights?.map(f => <option key={f.id} value={f.id}>{f.flightNumber ?? `#${f.id}`}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1.5">Số ghế <span className="text-[var(--color-danger)]">*</span></label><input required value={form.seatNumber} onChange={e => setForm({ ...form, seatNumber: e.target.value })} className="uppercase" placeholder="A1" /></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button><Button type="submit" disabled={createMut.isPending}>Tạo</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={bookId !== null} onClose={() => setBookId(null)} onConfirm={() => bookId && bookMut.mutate(bookId)} title="Đặt ghế" message="Đánh dấu ghế này là đã đặt?" confirmText="Xác nhận" loading={bookMut.isPending} />
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flightApi, Seat, Flight } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminSeatsPage() {
  const qc = useQueryClient();
  const [flightFilter, setFlightFilter] = useState<number | ''>('');
  const [seatNumber, setSeatNumber] = useState('');
  const [booked, setBooked] = useState('');

  const { data: flights } = useQuery<Flight[]>({ queryKey: ['flights'], queryFn: flightApi.getFlights });
  const { data: seats, isLoading } = useQuery<Seat[]>({
    queryKey: ['adminSeats', flightFilter, seatNumber, booked],
    queryFn: () => flightApi.getSeats({
      flightId: flightFilter ? Number(flightFilter) : undefined,
      seatNumber: seatNumber || undefined,
      booked: booked === '' ? undefined : booked === 'true',
    }),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [form, setForm] = useState({ flightId: 0, seatNumber: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ flightId: 0, seatNumber: '', status: 'AVAILABLE' });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const flightMap = useMemo(() => {
    const m: Record<number, string> = {};
    flights?.forEach(f => {
      m[f.id] = f.flightNumber ?? `#${f.id}`;
    });
    return m;
  }, [flights]);

  const createMut = useMutation({
    mutationFn: () => flightApi.createSeat(form),
    onSuccess: () => {
      toast.success('Tạo ghế thành công');
      setModalOpen(false);
      qc.invalidateQueries({ queryKey: ['adminSeats'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Có lỗi xảy ra'),
  });

  const updateMut = useMutation({
    mutationFn: (d: { id: number; payload: Partial<Seat> }) => flightApi.updateSeat(d.id, d.payload),
    onSuccess: () => {
      toast.success('Cập nhật ghế thành công');
      setEditModalOpen(false);
      setEditId(null);
      qc.invalidateQueries({ queryKey: ['adminSeats'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Có lỗi xảy ra'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => flightApi.deleteSeat(id),
    onSuccess: () => {
      toast.success('Đã xóa ghế');
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ['adminSeats'] });
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || e.response?.data || 'Có lỗi xảy ra');
      setDeleteId(null);
    },
  });

  const openEdit = (seat: Seat) => {
    setEditId(seat.id);
    setEditForm({
      flightId: seat.flightId ?? (flights?.[0]?.id || 0),
      seatNumber: seat.seatNumber ?? '',
      status: seat.booked ? 'BOOKED' : (seat.status ?? 'AVAILABLE'),
    });
    setEditModalOpen(true);
  };

  const columns: Column<Seat>[] = [
    { key: 'id', header: 'ID' },
    { key: 'flightId', header: 'Chuyến bay', render: s => <span className="font-medium">{s.flightId ? (flightMap[s.flightId] ?? `#${s.flightId}`) : '-'}</span> },
    { key: 'seatNumber', header: 'Số ghế', render: s => <span className="font-mono font-bold">{s.seatNumber ?? '-'}</span> },
    {
      key: 'booked',
      header: 'Trạng thái',
      render: s => s.booked
        ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">BOOKED</span>
        : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">AVAILABLE</span>,
    },
    {
      key: '_actions',
      header: '',
      sortable: false,
      render: s => {
        const isBooked = Boolean(s.booked || (s.status ?? '').toUpperCase() === 'BOOKED');
        return (
          <div className="flex items-center justify-end gap-1">
            {!isBooked && (
              <>
                <Button size="sm" variant="ghost" onClick={() => openEdit(s)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleteId(s.id)} className="text-[var(--color-danger)]">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý ghế ngồi</h1>
        <Button onClick={() => { setForm({ flightId: flights?.[0]?.id || 0, seatNumber: '' }); setModalOpen(true); }} className="gap-1.5"><Plus className="w-4 h-4" /> Thêm ghế</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-2 mb-4">
        <select value={flightFilter} onChange={e => setFlightFilter(e.target.value ? Number(e.target.value) : '')}><option value="">Tất cả chuyến</option>{flights?.map(f => <option key={f.id} value={f.id}>{f.flightNumber ?? `#${f.id}`}</option>)}</select>
        <input placeholder="Số ghế (VD: A1)" value={seatNumber} onChange={e => setSeatNumber(e.target.value)} />
        <select value={booked} onChange={e => setBooked(e.target.value)}><option value="">Tất cả trạng thái</option><option value="false">AVAILABLE</option><option value="true">BOOKED</option></select>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={5} /></div> : <DataTable columns={columns} data={seats ?? []} pageSize={15} />}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tạo ghế mới">
        <form onSubmit={e => { e.preventDefault(); createMut.mutate(); }} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Chuyến bay</label><select value={form.flightId} onChange={e => setForm({ ...form, flightId: Number(e.target.value) })}>{flights?.map(f => <option key={f.id} value={f.id}>{f.flightNumber ?? `#${f.id}`}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1.5">Số ghế</label><input required value={form.seatNumber} onChange={e => setForm({ ...form, seatNumber: e.target.value.toUpperCase() })} placeholder="A1" /></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button><Button type="submit" disabled={createMut.isPending}>Tạo</Button></div>
        </form>
      </Modal>

      <Modal open={editModalOpen} onClose={() => { setEditModalOpen(false); setEditId(null); }} title="Sửa ghế">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (!editId) return;
            updateMut.mutate({
              id: editId,
              payload: {
                flightId: editForm.flightId,
                seatNumber: editForm.seatNumber.toUpperCase(),
                status: editForm.status,
              },
            });
          }}
          className="space-y-4"
        >
          <div><label className="block text-sm font-medium mb-1.5">Chuyến bay</label><select value={editForm.flightId} onChange={e => setEditForm({ ...editForm, flightId: Number(e.target.value) })}>{flights?.map(f => <option key={f.id} value={f.id}>{f.flightNumber ?? `#${f.id}`}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1.5">Số ghế</label><input required value={editForm.seatNumber} onChange={e => setEditForm({ ...editForm, seatNumber: e.target.value })} placeholder="A1" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Trạng thái</label><select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}><option value="AVAILABLE">AVAILABLE</option><option value="HELD">HELD</option><option value="BOOKED">BOOKED</option></select></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => { setEditModalOpen(false); setEditId(null); }}>Hủy</Button><Button type="submit" disabled={updateMut.isPending}>Lưu</Button></div>
        </form>
      </Modal>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa ghế" message="Bạn có chắc chắn muốn xóa ghế này? Hành động này không thể hoàn tác." confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}

import { useMemo, useState } from 'react';
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
  const [seatNumber, setSeatNumber] = useState('');
  const [booked, setBooked] = useState('');

  const { data: flights } = useQuery<Flight[]>({ queryKey: ['flights'], queryFn: flightApi.getFlights });
  const { data: seats, isLoading } = useQuery<Seat[]>({
    queryKey: ['adminSeats', flightFilter, seatNumber, booked],
    queryFn: () => flightApi.getSeats({ flightId: flightFilter ? Number(flightFilter) : undefined, seatNumber: seatNumber || undefined, booked: booked === '' ? undefined : booked === 'true' }),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ flightId: 0, seatNumber: '' });
  const [bookId, setBookId] = useState<number | null>(null);

  const flightMap = useMemo(() => {
    const m: Record<number, string> = {};
    flights?.forEach(f => {
      m[f.id] = f.flightNumber ?? `#${f.id}`;
    });
    return m;
  }, [flights]);

  const createMut = useMutation({ mutationFn: () => flightApi.createSeat(form), onSuccess: () => { toast.success('T?o gh? thành công'); setModalOpen(false); qc.invalidateQueries({ queryKey: ['adminSeats'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Có l?i x?y ra') });
  const bookMut = useMutation({ mutationFn: (id: number) => flightApi.bookSeat(id), onSuccess: () => { toast.success('Ðã dánh d?u gh? BOOKED'); setBookId(null); qc.invalidateQueries({ queryKey: ['adminSeats'] }); }, onError: (e: any) => { toast.error(e.response?.data?.message || e.response?.data || 'Có l?i x?y ra'); setBookId(null); } });

  const columns: Column<Seat>[] = [
    { key: 'id', header: 'ID' },
    { key: 'flightId', header: 'Chuy?n bay', render: s => <span className="font-medium">{s.flightId ? (flightMap[s.flightId] ?? `#${s.flightId}`) : '-'}</span> },
    { key: 'seatNumber', header: 'S? gh?', render: s => <span className="font-mono font-bold">{s.seatNumber ?? '-'}</span> },
    { key: 'booked', header: 'Tr?ng thái', render: s => s.booked ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">BOOKED</span> : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">AVAILABLE</span> },
    { key: '_actions', header: '', sortable: false, render: s => !s.booked ? <Button size="sm" variant="ghost" onClick={() => setBookId(s.id)} className="text-[var(--color-primary)]"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Book</Button> : null },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Qu?n lý gh? ng?i</h1>
        <Button onClick={() => { setForm({ flightId: flights?.[0]?.id || 0, seatNumber: '' }); setModalOpen(true); }} className="gap-1.5"><Plus className="w-4 h-4" /> Thêm gh?</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-2 mb-4">
        <select value={flightFilter} onChange={e => setFlightFilter(e.target.value ? Number(e.target.value) : '')}><option value="">T?t c? chuy?n</option>{flights?.map(f => <option key={f.id} value={f.id}>{f.flightNumber ?? `#${f.id}`}</option>)}</select>
        <input placeholder="S? gh? (VD: A1)" value={seatNumber} onChange={e => setSeatNumber(e.target.value)} />
        <select value={booked} onChange={e => setBooked(e.target.value)}><option value="">T?t c? tr?ng thái</option><option value="false">AVAILABLE</option><option value="true">BOOKED</option></select>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={5} /></div> : <DataTable columns={columns} data={seats ?? []} pageSize={15} />}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="T?o gh? m?i">
        <form onSubmit={e => { e.preventDefault(); createMut.mutate(); }} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Chuy?n bay</label><select value={form.flightId} onChange={e => setForm({ ...form, flightId: Number(e.target.value) })}>{flights?.map(f => <option key={f.id} value={f.id}>{f.flightNumber ?? `#${f.id}`}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1.5">S? gh?</label><input required value={form.seatNumber} onChange={e => setForm({ ...form, seatNumber: e.target.value.toUpperCase() })} placeholder="A1" /></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>H?y</Button><Button type="submit" disabled={createMut.isPending}>T?o</Button></div>
        </form>
      </Modal>

      <ConfirmDialog open={bookId !== null} onClose={() => setBookId(null)} onConfirm={() => bookId && bookMut.mutate(bookId)} title="Book gh?" message="Xác nh?n dánh d?u gh? này là BOOKED?" confirmText="Xác nh?n" loading={bookMut.isPending} />
    </div>
  );
}


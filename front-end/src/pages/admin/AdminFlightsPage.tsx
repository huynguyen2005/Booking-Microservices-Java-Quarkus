import { useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flightApi, Flight, Airport, Airplane } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { ImageIcon, Pencil, Plus, Trash2, Upload } from 'lucide-react';

export default function AdminFlightsPage() {
  const qc = useQueryClient();
  const { data: airports } = useQuery<Airport[]>({ queryKey: ['airportsList'], queryFn: flightApi.getAirports });
  const { data: airplanes } = useQuery<Airplane[]>({ queryKey: ['airplanesList'], queryFn: flightApi.getAirplanes });

  const [keyword, setKeyword] = useState('');
  const [departureAirportId, setDepartureAirportId] = useState('');
  const [arrivalAirportId, setArrivalAirportId] = useState('');
  const [status, setStatus] = useState('');

  const { data: flights, isLoading } = useQuery<Flight[]>({
    queryKey: ['adminFlights', keyword, departureAirportId, arrivalAirportId, status],
    queryFn: () => flightApi.searchFlights({ keyword: keyword || undefined, departureAirportId: departureAirportId ? Number(departureAirportId) : undefined, arrivalAirportId: arrivalAirportId ? Number(arrivalAirportId) : undefined, status: status || undefined }),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ flightNumber: '', departureAirportId: 0, arrivalAirportId: 0, airplaneId: 0, departureTime: '', arrivalTime: '', status: 'SCHEDULED', basePrice: 0, currency: 'VND' });
  const [uploadId, setUploadId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const airportMap = useMemo(() => Object.fromEntries((airports ?? []).map(a => [a.id, a])), [airports]);
  const airplaneMap = useMemo(() => Object.fromEntries((airplanes ?? []).map(a => [a.id, a])), [airplanes]);

  const openModal = (f?: Flight) => {
    if (f) {
      setEditingId(f.id);
      setForm({ flightNumber: f.flightNumber ?? '', departureAirportId: f.departureAirportId ?? (airports?.[0]?.id || 0), arrivalAirportId: f.arrivalAirportId ?? (airports?.[0]?.id || 0), airplaneId: f.airplaneId ?? (airplanes?.[0]?.id || 0), departureTime: f.departureTime ? f.departureTime.slice(0, 16) : '', arrivalTime: f.arrivalTime ? f.arrivalTime.slice(0, 16) : '', status: f.status ?? 'SCHEDULED', basePrice: Number(f.basePrice ?? 0), currency: (f.currency ?? 'VND').toUpperCase() });
    } else {
      setEditingId(null);
      setForm({ flightNumber: '', departureAirportId: airports?.[0]?.id || 0, arrivalAirportId: airports?.[1]?.id || airports?.[0]?.id || 0, airplaneId: airplanes?.[0]?.id || 0, departureTime: '', arrivalTime: '', status: 'SCHEDULED', basePrice: 0, currency: 'VND' });
    }
    setModalOpen(true);
  };

  const createMut = useMutation({ mutationFn: flightApi.createFlight, onSuccess: () => { toast.success('Thêm chuy?n bay thành công'); setModalOpen(false); qc.invalidateQueries({ queryKey: ['adminFlights'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Có l?i x?y ra') });
  const updateMut = useMutation({ mutationFn: (d: { id: number; payload: Partial<Flight> }) => flightApi.updateFlight(d.id, d.payload), onSuccess: () => { toast.success('C?p nh?t chuy?n bay thành công'); setModalOpen(false); qc.invalidateQueries({ queryKey: ['adminFlights'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Có l?i x?y ra') });
  const deleteMut = useMutation({ mutationFn: flightApi.deleteFlight, onSuccess: () => { toast.success('Ðã xóa chuy?n bay'); setDeleteId(null); qc.invalidateQueries({ queryKey: ['adminFlights'] }); }, onError: (e: any) => { toast.error(e.response?.data?.message || e.response?.data || 'Có l?i x?y ra'); setDeleteId(null); } });
  const uploadMut = useMutation({ mutationFn: (file: File) => flightApi.uploadFlightImage(uploadId!, file), onSuccess: () => { toast.success('Upload ?nh thành công'); setUploadId(null); qc.invalidateQueries({ queryKey: ['adminFlights'] }); }, onError: () => toast.error('Upload th?t b?i') });

  const columns: Column<Flight>[] = [
    { key: 'id', header: 'ID' },
    { key: 'flightNumber', header: 'Chuy?n bay', render: f => <span className="font-bold text-[var(--color-primary)]">{f.flightNumber ?? '-'}</span> },
    { key: 'departureAirportId', header: 'Tuy?n bay', render: f => <span className="text-sm">{airportMap[f.departureAirportId]?.code ?? '?'} {'->'} {airportMap[f.arrivalAirportId]?.code ?? '?'}</span> },
    { key: 'departureTime', header: 'Kh?i hành', render: f => f.departureTime ? <span className="text-xs">{new Date(f.departureTime).toLocaleString('vi-VN')}</span> : '-' },
    { key: 'arrivalTime', header: 'Ð?n', render: f => f.arrivalTime ? <span className="text-xs">{new Date(f.arrivalTime).toLocaleString('vi-VN')}</span> : '-' },
    { key: 'airplaneId', header: 'Máy bay', render: f => airplaneMap[f.airplaneId]?.code ?? `#${f.airplaneId}` },
    { key: 'basePrice', header: 'Giá vé', render: f => <span className="font-medium">{Number(f.basePrice ?? 0).toLocaleString('vi-VN')} {(f.currency ?? 'VND').toUpperCase()}</span> },
    { key: 'status', header: 'Tr?ng thái', render: f => <StatusBadge status={f.status} /> },
    { key: 'imageUrl', header: '?nh', sortable: false, render: f => f.imageUrl ? <img src={f.imageUrl} alt="Flight" className="w-10 h-10 rounded object-cover" /> : <ImageIcon className="w-5 h-5 opacity-30" /> },
    { key: '_actions', header: '', sortable: false, render: f => <div className="flex gap-1 justify-end"><Button size="sm" variant="ghost" onClick={() => { setUploadId(f.id); fileRef.current?.click(); }}><Upload className="w-3.5 h-3.5" /></Button><Button size="sm" variant="ghost" onClick={() => openModal(f)}><Pencil className="w-3.5 h-3.5" /></Button><Button size="sm" variant="ghost" onClick={() => setDeleteId(f.id)} className="text-[var(--color-danger)]"><Trash2 className="w-3.5 h-3.5" /></Button></div> },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Qu?n lý chuy?n bay</h1>
        <Button onClick={() => openModal()} className="gap-1.5"><Plus className="w-4 h-4" /> Thêm m?i</Button>
      </div>

      <div className="grid md:grid-cols-4 gap-2 mb-4">
        <input placeholder="Tìm theo mã chuy?n" value={keyword} onChange={e => setKeyword(e.target.value)} />
        <select value={departureAirportId} onChange={e => setDepartureAirportId(e.target.value)}><option value="">T?t c? sân bay di</option>{airports?.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}</select>
        <select value={arrivalAirportId} onChange={e => setArrivalAirportId(e.target.value)}><option value="">T?t c? sân bay d?n</option>{airports?.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}</select>
        <select value={status} onChange={e => setStatus(e.target.value)}><option value="">T?t c? tr?ng thái</option><option value="SCHEDULED">SCHEDULED</option><option value="DELAYED">DELAYED</option><option value="CANCELLED">CANCELLED</option><option value="COMPLETED">COMPLETED</option></select>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={9} /></div> : <DataTable columns={columns} data={flights ?? []} pageSize={10} />}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadMut.mutate(f); }} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'C?p nh?t chuy?n bay' : 'Thêm chuy?n bay'} maxWidth="max-w-xl">
        <form onSubmit={e => { e.preventDefault(); if (editingId) updateMut.mutate({ id: editingId, payload: form }); else createMut.mutate(form); }} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Mã chuy?n bay</label><input required value={form.flightNumber} onChange={e => setForm({ ...form, flightNumber: e.target.value.toUpperCase() })} /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5">Sân bay di</label><select value={form.departureAirportId} onChange={e => setForm({ ...form, departureAirportId: Number(e.target.value) })}>{airports?.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}</select></div><div><label className="block text-sm font-medium mb-1.5">Sân bay d?n</label><select value={form.arrivalAirportId} onChange={e => setForm({ ...form, arrivalAirportId: Number(e.target.value) })}>{airports?.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}</select></div></div>
          <div><label className="block text-sm font-medium mb-1.5">Máy bay</label><select value={form.airplaneId} onChange={e => setForm({ ...form, airplaneId: Number(e.target.value) })}>{airplanes?.map(a => <option key={a.id} value={a.id}>{a.code} - {a.model}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Giá vé cơ bản</label><input required min={0} type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: Number(e.target.value) })} /></div>
            <div><label className="block text-sm font-medium mb-1.5">Tiền tệ</label><input required value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value.toUpperCase() })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5">Gi? kh?i hành</label><input required type="datetime-local" value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })} /></div><div><label className="block text-sm font-medium mb-1.5">Gi? d?n</label><input required type="datetime-local" value={form.arrivalTime} onChange={e => setForm({ ...form, arrivalTime: e.target.value })} /></div></div>
          <div><label className="block text-sm font-medium mb-1.5">Tr?ng thái</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="SCHEDULED">SCHEDULED</option><option value="DELAYED">DELAYED</option><option value="CANCELLED">CANCELLED</option><option value="COMPLETED">COMPLETED</option></select></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>H?y</Button><Button type="submit" disabled={createMut.isPending || updateMut.isPending}>Luu</Button></div>
        </form>
      </Modal>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa chuy?n bay" message="B?n có ch?c ch?n mu?n xóa chuy?n bay này?" confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}



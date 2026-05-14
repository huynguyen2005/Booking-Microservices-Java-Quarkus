import { useState, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flightApi, Flight, Airport, Airplane } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Plus, Pencil, Trash2, Upload, ImageIcon } from 'lucide-react';

export default function AdminFlightsPage() {
  const qc = useQueryClient();
  const { data: flights, isLoading } = useQuery<Flight[]>({ queryKey: ['adminFlights'], queryFn: flightApi.getFlights });
  const { data: airports } = useQuery<Airport[]>({ queryKey: ['airportsList'], queryFn: flightApi.getAirports });
  const { data: airplanes } = useQuery<Airplane[]>({ queryKey: ['airplanesList'], queryFn: flightApi.getAirplanes });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ flightNumber: '', departureAirportId: 0, arrivalAirportId: 0, airplaneId: 0, departureTime: '', arrivalTime: '', status: 'SCHEDULED' });
  const [uploadId, setUploadId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const airportMap = useMemo(() => {
    const m: Record<number, Airport> = {};
    airports?.forEach(a => { m[a.id] = a; });
    return m;
  }, [airports]);
  const airplaneMap = useMemo(() => {
    const m: Record<number, Airplane> = {};
    airplanes?.forEach(a => { m[a.id] = a; });
    return m;
  }, [airplanes]);

  const openModal = (f?: Flight) => {
    if (f) {
      setEditingId(f.id);
      setForm({
        flightNumber: f.flightNumber ?? '',
        departureAirportId: f.departureAirportId ?? (airports?.[0]?.id || 0),
        arrivalAirportId: f.arrivalAirportId ?? (airports?.[0]?.id || 0),
        airplaneId: f.airplaneId ?? (airplanes?.[0]?.id || 0),
        departureTime: f.departureTime ? f.departureTime.slice(0, 16) : '',
        arrivalTime: f.arrivalTime ? f.arrivalTime.slice(0, 16) : '',
        status: f.status ?? 'SCHEDULED'
      });
    } else {
      setEditingId(null);
      setForm({ flightNumber: '', departureAirportId: airports?.[0]?.id || 0, arrivalAirportId: airports?.[1]?.id || airports?.[0]?.id || 0, airplaneId: airplanes?.[0]?.id || 0, departureTime: '', arrivalTime: '', status: 'SCHEDULED' });
    }
    setModalOpen(true);
  };

  const createMut = useMutation({ mutationFn: flightApi.createFlight, onSuccess: () => { toast.success('Thêm chuyến bay thành công!'); setModalOpen(false); qc.invalidateQueries({ queryKey: ['adminFlights'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Lỗi') });
  const updateMut = useMutation({ mutationFn: (d: { id: number; payload: Partial<Flight> }) => flightApi.updateFlight(d.id, d.payload), onSuccess: () => { toast.success('Cập nhật thành công!'); setModalOpen(false); qc.invalidateQueries({ queryKey: ['adminFlights'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Lỗi') });
  const deleteMut = useMutation({ mutationFn: flightApi.deleteFlight, onSuccess: () => { toast.success('Đã xóa!'); setDeleteId(null); qc.invalidateQueries({ queryKey: ['adminFlights'] }); }, onError: (e: any) => { toast.error(e.response?.data?.message || e.response?.data || 'Lỗi'); setDeleteId(null); } });
  const uploadMut = useMutation({ mutationFn: (file: File) => flightApi.uploadFlightImage(uploadId!, file), onSuccess: () => { toast.success('Upload ảnh thành công!'); setUploadId(null); qc.invalidateQueries({ queryKey: ['adminFlights'] }); }, onError: () => toast.error('Upload thất bại') });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (editingId) updateMut.mutate({ id: editingId, payload: form }); else createMut.mutate(form); };
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) uploadMut.mutate(f); };

  const columns: Column<Flight>[] = [
    { key: 'id', header: 'ID' },
    { key: 'flightNumber', header: 'Chuyến bay', render: f => <span className="font-bold text-[var(--color-primary)]">{f.flightNumber ?? '—'}</span> },
    { key: 'departureAirportId', header: 'Tuyến bay', render: f => {
      const dep = f.departureAirportId ? airportMap[f.departureAirportId] : null;
      const arr = f.arrivalAirportId ? airportMap[f.arrivalAirportId] : null;
      return <span className="text-sm">{dep?.code ?? '?'} → {arr?.code ?? '?'}</span>;
    }},
    { key: 'departureTime', header: 'Khởi hành', render: f => f.departureTime ? <span className="text-xs">{new Date(f.departureTime).toLocaleString('vi-VN')}</span> : '—' },
    { key: 'arrivalTime', header: 'Đến', render: f => f.arrivalTime ? <span className="text-xs">{new Date(f.arrivalTime).toLocaleString('vi-VN')}</span> : '—' },
    { key: 'airplaneId', header: 'Máy bay', render: f => f.airplaneId ? (airplaneMap[f.airplaneId]?.code ?? `#${f.airplaneId}`) : '—' },
    { key: 'status', header: 'Trạng thái', render: f => <StatusBadge status={f.status} /> },
    { key: 'imageUrl', header: 'Ảnh', sortable: false, render: f => f.imageUrl ? <img src={f.imageUrl} alt="" className="w-10 h-10 rounded object-cover" /> : <ImageIcon className="w-5 h-5 opacity-30" /> },
    { key: '_actions', header: '', sortable: false, render: f => (
      <div className="flex gap-1 justify-end">
        <Button size="sm" variant="ghost" onClick={() => { setUploadId(f.id); fileRef.current?.click(); }}><Upload className="w-3.5 h-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={() => openModal(f)}><Pencil className="w-3.5 h-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={() => setDeleteId(f.id)} className="text-[var(--color-danger)]"><Trash2 className="w-3.5 h-3.5" /></Button>
      </div>
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Chuyến bay</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Thêm và quản lý các chuyến bay.</p>
        </div>
        <Button onClick={() => openModal()} className="gap-1.5"><Plus className="w-4 h-4" /> Thêm</Button>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={8} /></div> : <DataTable columns={columns} data={flights ?? []} pageSize={10} />}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Sửa chuyến bay' : 'Thêm chuyến bay'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Mã chuyến bay <span className="text-[var(--color-danger)]">*</span></label><input required value={form.flightNumber} onChange={e => setForm({ ...form, flightNumber: e.target.value })} className="uppercase" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Từ sân bay</label><select value={form.departureAirportId} onChange={e => setForm({ ...form, departureAirportId: Number(e.target.value) })}>{airports?.map(a => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1.5">Đến sân bay</label><select value={form.arrivalAirportId} onChange={e => setForm({ ...form, arrivalAirportId: Number(e.target.value) })}>{airports?.map(a => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}</select></div>
          </div>
          <div><label className="block text-sm font-medium mb-1.5">Máy bay</label><select value={form.airplaneId} onChange={e => setForm({ ...form, airplaneId: Number(e.target.value) })}>{airplanes?.map(a => <option key={a.id} value={a.id}>{a.code} — {a.model}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Khởi hành <span className="text-[var(--color-danger)]">*</span></label><input required type="datetime-local" value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1.5">Đến <span className="text-[var(--color-danger)]">*</span></label><input required type="datetime-local" value={form.arrivalTime} onChange={e => setForm({ ...form, arrivalTime: e.target.value })} /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1.5">Trạng thái</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="SCHEDULED">SCHEDULED</option><option value="DELAYED">DELAYED</option><option value="CANCELLED">CANCELLED</option><option value="COMPLETED">COMPLETED</option></select></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button><Button type="submit" disabled={createMut.isPending || updateMut.isPending}>{editingId ? 'Cập nhật' : 'Tạo chuyến bay'}</Button></div>
        </form>
      </Modal>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa chuyến bay" message="Bạn có chắc chắn muốn xóa chuyến bay này?" confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}

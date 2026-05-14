import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flightApi, Flight, Airport, Airplane } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Plus, Pencil, Trash2, Upload, ImageIcon } from 'lucide-react';

export default function AdminFlightsPage() {
  const queryClient = useQueryClient();
  const { data: flights, isLoading } = useQuery<Flight[]>({ queryKey: ['adminFlights'], queryFn: flightApi.getFlights });
  const { data: airports } = useQuery<Airport[]>({ queryKey: ['airportsList'], queryFn: flightApi.getAirports });
  const { data: airplanes } = useQuery<Airplane[]>({ queryKey: ['airplanesList'], queryFn: flightApi.getAirplanes });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Flight>>({ flightNumber: '', departureAirportId: 0, arrivalAirportId: 0, airplaneId: 0, departureTime: '', arrivalTime: '', status: 'SCHEDULED' });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploadId, setUploadId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const airportMap: Record<number, Airport> = {};
  airports?.forEach(a => { airportMap[a.id] = a; });
  const airplaneMap: Record<number, Airplane> = {};
  airplanes?.forEach(a => { airplaneMap[a.id] = a; });

  const openModal = (f?: Flight) => {
    if (f) {
      setEditingId(f.id);
      setFormData({ flightNumber: f.flightNumber, departureAirportId: f.departureAirportId, arrivalAirportId: f.arrivalAirportId, airplaneId: f.airplaneId, departureTime: f.departureTime?.slice(0, 16), arrivalTime: f.arrivalTime?.slice(0, 16), status: f.status });
    } else {
      setEditingId(null);
      setFormData({ flightNumber: '', departureAirportId: airports?.[0]?.id || 0, arrivalAirportId: airports?.[0]?.id || 0, airplaneId: airplanes?.[0]?.id || 0, departureTime: '', arrivalTime: '', status: 'SCHEDULED' });
    }
    setModalOpen(true);
  };

  const createMut = useMutation({ mutationFn: flightApi.createFlight, onSuccess: () => { toast.success('Thêm chuyến bay thành công!'); setModalOpen(false); queryClient.invalidateQueries({ queryKey: ['adminFlights'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Lỗi') });
  const updateMut = useMutation({ mutationFn: (data: { id: number; payload: Partial<Flight> }) => flightApi.updateFlight(data.id, data.payload), onSuccess: () => { toast.success('Cập nhật thành công!'); setModalOpen(false); queryClient.invalidateQueries({ queryKey: ['adminFlights'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Lỗi') });
  const deleteMut = useMutation({ mutationFn: flightApi.deleteFlight, onSuccess: () => { toast.success('Đã xóa!'); setDeleteId(null); queryClient.invalidateQueries({ queryKey: ['adminFlights'] }); }, onError: (e: any) => { toast.error(e.response?.data?.message || 'Lỗi'); setDeleteId(null); } });
  const uploadMut = useMutation({ mutationFn: (file: File) => flightApi.uploadFlightImage(uploadId!, file), onSuccess: () => { toast.success('Upload ảnh thành công!'); setUploadId(null); queryClient.invalidateQueries({ queryKey: ['adminFlights'] }); }, onError: () => toast.error('Upload thất bại') });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (editingId) updateMut.mutate({ id: editingId, payload: formData }); else createMut.mutate(formData); };
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) uploadMut.mutate(f); };

  const columns: Column<Flight>[] = [
    { key: 'flightNumber', header: 'Chuyến bay', render: f => <span className="font-bold text-[var(--color-primary)]">{f.flightNumber}</span> },
    { key: 'departureAirportId', header: 'Tuyến bay', render: f => <span className="text-sm">{airportMap[f.departureAirportId]?.code ?? f.departureAirportId} → {airportMap[f.arrivalAirportId]?.code ?? f.arrivalAirportId}</span> },
    { key: 'departureTime', header: 'Khởi hành', render: f => <span className="text-xs">{new Date(f.departureTime).toLocaleString('vi-VN')}</span> },
    { key: 'arrivalTime', header: 'Đến', render: f => <span className="text-xs">{new Date(f.arrivalTime).toLocaleString('vi-VN')}</span> },
    { key: 'airplaneId', header: 'Máy bay', render: f => airplaneMap[f.airplaneId]?.code ?? `#${f.airplaneId}` },
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
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Chuyến bay</h1>
        <Button onClick={() => openModal()} className="gap-1.5"><Plus className="w-4 h-4" /> Thêm</Button>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={7} /></div> : <DataTable columns={columns} data={flights ?? []} pageSize={10} />}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Sửa chuyến bay' : 'Thêm chuyến bay'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Mã chuyến bay</label><input required className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] uppercase" value={formData.flightNumber} onChange={e => setFormData({...formData, flightNumber: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Từ sân bay</label><select className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.departureAirportId} onChange={e => setFormData({...formData, departureAirportId: Number(e.target.value)})}>{airports?.map(a => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Đến sân bay</label><select className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.arrivalAirportId} onChange={e => setFormData({...formData, arrivalAirportId: Number(e.target.value)})}>{airports?.map(a => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}</select></div>
          </div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Máy bay</label><select className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.airplaneId} onChange={e => setFormData({...formData, airplaneId: Number(e.target.value)})}>{airplanes?.map(a => <option key={a.id} value={a.id}>{a.code} — {a.model}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Khởi hành</label><input required type="datetime-local" className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} /></div>
            <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Đến</label><input required type="datetime-local" className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} /></div>
          </div>
          {editingId && (
            <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Trạng thái</label><select className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option value="SCHEDULED">SCHEDULED</option><option value="CANCELLED">CANCELLED</option></select></div>
          )}
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button><Button type="submit" disabled={createMut.isPending || updateMut.isPending}>Lưu</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa chuyến bay" message="Xóa chuyến bay này?" confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}

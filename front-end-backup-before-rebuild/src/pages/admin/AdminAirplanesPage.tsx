import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flightApi, Airplane } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Plus, Pencil, Trash2, Upload, ImageIcon } from 'lucide-react';

export default function AdminAirplanesPage() {
  const queryClient = useQueryClient();
  const { data: airplanes, isLoading } = useQuery<Airplane[]>({ queryKey: ['adminAirplanes'], queryFn: flightApi.getAirplanes });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ code: '', model: '', totalSeats: 0 });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploadId, setUploadId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const openModal = (a?: Airplane) => {
    if (a) { setEditingId(a.id); setFormData({ code: a.code, model: a.model, totalSeats: a.totalSeats }); }
    else { setEditingId(null); setFormData({ code: '', model: '', totalSeats: 0 }); }
    setModalOpen(true);
  };

  const createMut = useMutation({ mutationFn: flightApi.createAirplane, onSuccess: () => { toast.success('Thêm máy bay thành công!'); setModalOpen(false); queryClient.invalidateQueries({ queryKey: ['adminAirplanes'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Lỗi') });
  const updateMut = useMutation({ mutationFn: (data: {id: number, payload: Partial<Airplane>}) => flightApi.updateAirplane(data.id, data.payload), onSuccess: () => { toast.success('Cập nhật thành công!'); setModalOpen(false); queryClient.invalidateQueries({ queryKey: ['adminAirplanes'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Lỗi') });
  const deleteMut = useMutation({ mutationFn: flightApi.deleteAirplane, onSuccess: () => { toast.success('Đã xóa!'); setDeleteId(null); queryClient.invalidateQueries({ queryKey: ['adminAirplanes'] }); }, onError: (e: any) => { toast.error(e.response?.data?.message || 'Lỗi'); setDeleteId(null); } });
  const uploadMut = useMutation({ mutationFn: (file: File) => flightApi.uploadAirplaneImage(uploadId!, file), onSuccess: () => { toast.success('Upload ảnh thành công!'); setUploadId(null); queryClient.invalidateQueries({ queryKey: ['adminAirplanes'] }); }, onError: () => toast.error('Upload thất bại') });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (editingId) updateMut.mutate({ id: editingId, payload: formData }); else createMut.mutate(formData); };
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) uploadMut.mutate(f); };

  const columns: Column<Airplane>[] = [
    { key: 'id', header: 'ID' },
    { key: 'code', header: 'Mã', render: a => <span className="font-bold text-[var(--color-primary)]">{a.code}</span> },
    { key: 'model', header: 'Model', render: a => <span className="font-medium text-[var(--color-text-main)]">{a.model}</span> },
    { key: 'totalSeats', header: 'Tổng ghế' },
    { key: 'imageUrl', header: 'Ảnh', sortable: false, render: a => a.imageUrl ? <img src={a.imageUrl} alt="" className="w-10 h-10 rounded object-cover" /> : <ImageIcon className="w-5 h-5 text-[var(--color-text-muted)] opacity-30" /> },
    { key: '_actions', header: '', sortable: false, render: a => (
      <div className="flex gap-1 justify-end">
        <Button size="sm" variant="ghost" onClick={() => { setUploadId(a.id); fileRef.current?.click(); }} title="Upload ảnh"><Upload className="w-3.5 h-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={() => openModal(a)}><Pencil className="w-3.5 h-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={() => setDeleteId(a.id)} className="text-[var(--color-danger)]"><Trash2 className="w-3.5 h-3.5" /></Button>
      </div>
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Máy bay</h1>
        <Button onClick={() => openModal()} className="gap-1.5"><Plus className="w-4 h-4" /> Thêm</Button>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={5} /></div> : <DataTable columns={columns} data={airplanes ?? []} pageSize={10} />}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Sửa máy bay' : 'Thêm máy bay'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Mã (VD: VN-A123)</label><input required className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] uppercase" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Model</label><input required className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Tổng số ghế</label><input required type="number" min="1" className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.totalSeats} onChange={e => setFormData({...formData, totalSeats: Number(e.target.value)})} /></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button><Button type="submit" disabled={createMut.isPending || updateMut.isPending}>Lưu</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa máy bay" message="Xóa máy bay này?" confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}

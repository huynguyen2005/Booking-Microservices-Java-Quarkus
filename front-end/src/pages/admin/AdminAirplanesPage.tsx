import { useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flightApi, Airplane } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { ImageIcon, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react';

export default function AdminAirplanesPage() {
  const qc = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const { data: airplanes, isLoading } = useQuery<Airplane[]>({
    queryKey: ['adminAirplanes', keyword],
    queryFn: () => (keyword ? flightApi.searchAirplanes(keyword) : flightApi.getAirplanes()),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ code: '', model: '', totalSeats: 0 });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploadId, setUploadId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const openModal = (a?: Airplane) => {
    if (a) {
      setEditingId(a.id);
      setForm({ code: a.code ?? '', model: a.model ?? '', totalSeats: a.totalSeats });
    } else {
      setEditingId(null);
      setForm({ code: '', model: '', totalSeats: 0 });
    }
    setModalOpen(true);
  };

  const createMut = useMutation({ mutationFn: flightApi.createAirplane, onSuccess: () => { toast.success('Thêm máy bay thành công'); setModalOpen(false); qc.invalidateQueries({ queryKey: ['adminAirplanes'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Có l?i x?y ra') });
  const updateMut = useMutation({ mutationFn: (d: { id: number; payload: Partial<Airplane> }) => flightApi.updateAirplane(d.id, d.payload), onSuccess: () => { toast.success('C?p nh?t máy bay thành công'); setModalOpen(false); qc.invalidateQueries({ queryKey: ['adminAirplanes'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Có l?i x?y ra') });
  const deleteMut = useMutation({ mutationFn: flightApi.deleteAirplane, onSuccess: () => { toast.success('Ðã xóa máy bay'); setDeleteId(null); qc.invalidateQueries({ queryKey: ['adminAirplanes'] }); }, onError: (e: any) => { toast.error(e.response?.data?.message || e.response?.data || 'Có l?i x?y ra'); setDeleteId(null); } });
  const uploadMut = useMutation({ mutationFn: (file: File) => flightApi.uploadAirplaneImage(uploadId!, file), onSuccess: () => { toast.success('Upload ?nh thành công'); setUploadId(null); qc.invalidateQueries({ queryKey: ['adminAirplanes'] }); }, onError: () => toast.error('Upload th?t b?i') });

  const columns: Column<Airplane>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'code', header: 'Mã', render: a => <span className="font-bold text-[var(--color-primary)]">{a.code ?? '-'}</span> },
    { key: 'model', header: 'Model', render: a => <span className="font-medium">{a.model ?? '-'}</span> },
    { key: 'totalSeats', header: 'T?ng gh?' },
    { key: 'imageUrl', header: '?nh', sortable: false, render: a => a.imageUrl ? <img src={a.imageUrl} alt="Airplane" className="w-10 h-10 rounded object-cover" /> : <ImageIcon className="w-5 h-5 opacity-30" /> },
    {
      key: '_actions',
      header: '',
      sortable: false,
      render: a => (
        <div className="flex gap-1 justify-end">
          <Button size="sm" variant="ghost" onClick={() => { setUploadId(a.id); fileRef.current?.click(); }}><Upload className="w-3.5 h-3.5" /></Button>
          <Button size="sm" variant="ghost" onClick={() => openModal(a)}><Pencil className="w-3.5 h-3.5" /></Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleteId(a.id)} className="text-[var(--color-danger)]"><Trash2 className="w-3.5 h-3.5" /></Button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Qu?n lý máy bay</h1>
        <div className="flex gap-2 items-center">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" /><input className="pl-9 w-64" placeholder="Tìm mã/model" value={keyword} onChange={e => setKeyword(e.target.value)} /></div>
          <Button onClick={() => openModal()} className="gap-1.5"><Plus className="w-4 h-4" /> Thêm m?i</Button>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={5} /></div> : <DataTable columns={columns} data={airplanes ?? []} pageSize={10} />}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadMut.mutate(f); }} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'C?p nh?t máy bay' : 'Thêm máy bay'}>
        <form onSubmit={e => { e.preventDefault(); if (editingId) updateMut.mutate({ id: editingId, payload: form }); else createMut.mutate(form); }} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Mã máy bay</label><input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Model</label><input required value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">T?ng s? gh?</label><input required type="number" min="1" value={form.totalSeats} onChange={e => setForm({ ...form, totalSeats: Number(e.target.value) })} /></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>H?y</Button><Button type="submit" disabled={createMut.isPending || updateMut.isPending}>Luu</Button></div>
        </form>
      </Modal>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa máy bay" message="B?n có ch?c ch?n mu?n xóa máy bay này?" confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}


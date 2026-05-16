import { useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flightApi, Airport } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { ImageIcon, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react';

export default function AdminAirportsPage() {
  const qc = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const { data: airports, isLoading } = useQuery<Airport[]>({
    queryKey: ['adminAirports', keyword],
    queryFn: () => (keyword ? flightApi.searchAirports(keyword) : flightApi.getAirports()),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ code: '', name: '', city: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploadId, setUploadId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const openModal = (a?: Airport) => {
    if (a) {
      setEditingId(a.id);
      setForm({ code: a.code ?? '', name: a.name ?? '', city: a.city ?? '' });
    } else {
      setEditingId(null);
      setForm({ code: '', name: '', city: '' });
    }
    setModalOpen(true);
  };

  const createMut = useMutation({
    mutationFn: flightApi.createAirport,
    onSuccess: () => {
      toast.success('Thêm sân bay thành công');
      setModalOpen(false);
      qc.invalidateQueries({ queryKey: ['adminAirports'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Có lỗi xảy ra'),
  });

  const updateMut = useMutation({
    mutationFn: (d: { id: number; payload: Partial<Airport> }) => flightApi.updateAirport(d.id, d.payload),
    onSuccess: () => {
      toast.success('Cập nhật sân bay thành công');
      setModalOpen(false);
      qc.invalidateQueries({ queryKey: ['adminAirports'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Có lỗi xảy ra'),
  });

  const deleteMut = useMutation({
    mutationFn: flightApi.deleteAirport,
    onSuccess: () => {
      toast.success('Đã xóa sân bay');
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ['adminAirports'] });
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || e.response?.data || 'Có lỗi xảy ra');
      setDeleteId(null);
    },
  });

  const uploadMut = useMutation({
    mutationFn: (file: File) => flightApi.uploadAirportImage(uploadId!, file),
    onSuccess: () => {
      toast.success('Upload ảnh thành công');
      setUploadId(null);
      qc.invalidateQueries({ queryKey: ['adminAirports'] });
    },
    onError: () => toast.error('Upload thất bại'),
  });

  const columns: Column<Airport>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'code', header: 'Mã', render: a => <span className="font-bold text-[var(--color-primary)]">{a.code ?? '-'}</span> },
    { key: 'name', header: 'Tên sân bay', render: a => <span className="font-medium">{a.name ?? '-'}</span> },
    { key: 'city', header: 'Thành phố', render: a => a.city ?? '-' },
    {
      key: 'imageUrl',
      header: 'Ảnh',
      sortable: false,
      render: a => a.imageUrl ? (
        <button type="button" onClick={() => setPreviewUrl(a.imageUrl!)} className="rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
          <img src={a.imageUrl} alt={`Ảnh sân bay ${a.code ?? ''}`} className="w-10 h-10 rounded object-cover cursor-zoom-in" />
        </button>
      ) : <ImageIcon className="w-5 h-5 opacity-30" />,
    },
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
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý sân bay</h1>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input className="pl-9 w-64" placeholder="Tìm mã/tên/thành phố" value={keyword} onChange={e => setKeyword(e.target.value)} />
          </div>
          <Button onClick={() => openModal()} className="gap-1.5"><Plus className="w-4 h-4" /> Thêm mới</Button>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={5} /></div> : <DataTable columns={columns} data={airports ?? []} pageSize={10} />}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadMut.mutate(f); }} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Cập nhật sân bay' : 'Thêm sân bay'}>
        <form onSubmit={e => {
          e.preventDefault();
          if (editingId) updateMut.mutate({ id: editingId, payload: form });
          else createMut.mutate(form);
        }} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Mã sân bay</label><input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Tên sân bay</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Thành phố</label><input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button><Button type="submit" disabled={createMut.isPending || updateMut.isPending}>Lưu</Button></div>
        </form>
      </Modal>

      <Modal open={previewUrl !== null} onClose={() => setPreviewUrl(null)} title="Xem ảnh sân bay">
        {previewUrl && (
          <div className="space-y-3">
            <img src={previewUrl} alt="Ảnh sân bay" className="w-full max-h-[70vh] rounded-md object-contain bg-[var(--color-surface-subtle)]" />
            <div className="flex justify-end">
              <a href={previewUrl} target="_blank" rel="noreferrer" className="text-sm text-[var(--color-primary)] hover:underline">
                Mở ảnh trong tab mới
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa sân bay" message="Bạn có chắc chắn muốn xóa sân bay này? Hành động này không thể hoàn tác." confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}

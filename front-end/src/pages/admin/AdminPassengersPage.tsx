import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { passengerApi, Passenger } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Search, Pencil, Trash2 } from 'lucide-react';

export default function AdminPassengersPage() {
  const qc = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const { data: passengers, isLoading } = useQuery<Passenger[]>({
    queryKey: ['adminPassengers', keyword],
    queryFn: () => keyword ? passengerApi.search(keyword) : passengerApi.getAllPassengers(),
  });
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', passportNumber: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openEdit = (p: Passenger) => { setEditId(p.id); setForm({ fullName: p.fullName ?? '', email: p.email ?? '', phone: p.phone ?? '', passportNumber: p.passportNumber ?? '' }); setEditModal(true); };

  const updateMut = useMutation({ mutationFn: (d: { id: number; payload: Partial<Passenger> }) => passengerApi.updatePassenger(d.id, d.payload), onSuccess: () => { toast.success('Cập nhật thành công!'); setEditModal(false); qc.invalidateQueries({ queryKey: ['adminPassengers'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Lỗi') });
  const deleteMut = useMutation({ mutationFn: passengerApi.deletePassenger, onSuccess: () => { toast.success('Đã xóa!'); setDeleteId(null); qc.invalidateQueries({ queryKey: ['adminPassengers'] }); }, onError: (e: any) => { toast.error(e.response?.data?.message || e.response?.data || 'Lỗi'); setDeleteId(null); } });

  const columns: Column<Passenger>[] = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'User ID' },
    { key: 'fullName', header: 'Họ tên', render: p => <span className="font-medium">{p.fullName ?? '—'}</span> },
    { key: 'email', header: 'Email', render: p => p.email ?? '—' },
    { key: 'phone', header: 'SĐT', render: p => p.phone ?? '—' },
    { key: 'passportNumber', header: 'Hộ chiếu', render: p => p.passportNumber ? <span className="font-mono text-xs">{p.passportNumber}</span> : '—' },
    { key: '_actions', header: '', sortable: false, render: p => (
      <div className="flex gap-1 justify-end">
        <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={() => setDeleteId(p.id)} className="text-[var(--color-danger)]"><Trash2 className="w-3.5 h-3.5" /></Button>
      </div>
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Hành khách</h1>
        <div className="flex items-center gap-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" /><input className="pl-9 w-64 text-sm" placeholder="Tìm tên/email/passport..." value={keyword} onChange={e => setKeyword(e.target.value)} /></div>
        </div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={6} /></div> : <DataTable columns={columns} data={passengers ?? []} pageSize={10} />}
      </div>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Sửa hành khách">
        <form onSubmit={e => { e.preventDefault(); if (editId) updateMut.mutate({ id: editId, payload: form }); }} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Họ tên</label><input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">SĐT</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Passport / CCCD</label><input value={form.passportNumber} onChange={e => setForm({ ...form, passportNumber: e.target.value })} /></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setEditModal(false)}>Hủy</Button><Button type="submit" disabled={updateMut.isPending}>Lưu</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa hành khách" message="Xóa hành khách này?" confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}

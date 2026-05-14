import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { passengerApi, Passenger } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Pencil, Trash2, Search } from 'lucide-react';

export default function AdminPassengersPage() {
  const queryClient = useQueryClient();
  const { data: passengers, isLoading } = useQuery({ queryKey: ['adminPassengers'], queryFn: passengerApi.getAllPassengers });
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editPassenger, setEditPassenger] = useState<Passenger | null>(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', passportNumber: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openEdit = (p: Passenger) => {
    setEditPassenger(p);
    setFormData({ fullName: p.fullName, email: p.email || '', passportNumber: p.passportNumber || '' });
    setModalOpen(true);
  };

  const updateMut = useMutation({
    mutationFn: () => passengerApi.updatePassenger(editPassenger!.id, formData),
    onSuccess: () => { toast.success('Cập nhật thành công!'); setModalOpen(false); queryClient.invalidateQueries({ queryKey: ['adminPassengers'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Lỗi')
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => passengerApi.deletePassenger(id),
    onSuccess: () => { toast.success('Đã xóa!'); setDeleteId(null); queryClient.invalidateQueries({ queryKey: ['adminPassengers'] }); },
    onError: (e: any) => { toast.error(e.response?.data?.message || 'Lỗi'); setDeleteId(null); }
  });

  const filtered = passengers?.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.fullName.toLowerCase().includes(q) || (p.email?.toLowerCase().includes(q)) || (p.passportNumber?.toLowerCase().includes(q));
  }) ?? [];

  const columns: Column<Passenger>[] = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'User ID' },
    { key: 'fullName', header: 'Họ và Tên', render: p => <span className="font-medium text-[var(--color-text-main)]">{p.fullName}</span> },
    { key: 'email', header: 'Email', render: p => p.email || '—' },
    { key: 'passportNumber', header: 'Hộ chiếu/CCCD', render: p => p.passportNumber ? <span className="font-mono text-xs">{p.passportNumber}</span> : '—' },
    { key: '_actions', header: '', sortable: false, render: p => (
      <div className="flex gap-1 justify-end">
        <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={() => setDeleteId(p.id)} className="text-[var(--color-danger)]"><Trash2 className="w-3.5 h-3.5" /></Button>
      </div>
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Hành khách</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--color-text-muted)]" />
          <input type="text" placeholder="Tìm theo tên, email, passport..." className="h-10 pl-9 pr-3 w-72 border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={5} /></div> : <DataTable columns={columns} data={filtered} pageSize={10} />}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Sửa — ${editPassenger?.fullName}`}>
        <form onSubmit={e => { e.preventDefault(); updateMut.mutate(); }} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Họ tên</label><input required className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Email</label><input type="email" className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Số hộ chiếu / CCCD</label><input className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.passportNumber} onChange={e => setFormData({...formData, passportNumber: e.target.value})} /></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button><Button type="submit" disabled={updateMut.isPending}>Lưu</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa hành khách" message="Xóa hành khách này?" confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}

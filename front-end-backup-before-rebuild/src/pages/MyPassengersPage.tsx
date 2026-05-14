import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { passengerApi, Passenger } from '../api/endpoints';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DataTable, Column } from '../components/ui/DataTable';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { toast } from '../components/ui/Toast';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';

export default function MyPassengersPage() {
  const queryClient = useQueryClient();
  const { data: passengers, isLoading } = useQuery<Passenger[]>({ queryKey: ['myPassengers'], queryFn: passengerApi.getMyPassengers });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', passportNumber: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openModal = (p?: Passenger) => {
    if (p) {
      setEditingId(p.id);
      setFormData({ fullName: p.fullName, email: p.email || '', phone: p.phone || '', passportNumber: p.passportNumber || '' });
    } else {
      setEditingId(null);
      setFormData({ fullName: '', email: '', phone: '', passportNumber: '' });
    }
    setModalOpen(true);
  };

  const createMut = useMutation({
    mutationFn: passengerApi.createPassenger,
    onSuccess: () => { toast.success('Thêm hành khách thành công!'); setModalOpen(false); queryClient.invalidateQueries({ queryKey: ['myPassengers'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Lỗi thêm hành khách')
  });

  const updateMut = useMutation({
    mutationFn: (data: {id: number, payload: Partial<Passenger>}) => passengerApi.updatePassenger(data.id, data.payload),
    onSuccess: () => { toast.success('Cập nhật thành công!'); setModalOpen(false); queryClient.invalidateQueries({ queryKey: ['myPassengers'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Lỗi cập nhật')
  });

  const deleteMut = useMutation({
    mutationFn: passengerApi.deletePassenger,
    onSuccess: () => { toast.success('Đã xóa hành khách!'); setDeleteId(null); queryClient.invalidateQueries({ queryKey: ['myPassengers'] }); },
    onError: (e: any) => { toast.error(e.response?.data?.message || e.response?.data || 'Lỗi xóa'); setDeleteId(null); }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) updateMut.mutate({ id: editingId, payload: formData });
    else createMut.mutate(formData);
  };

  const columns: Column<Passenger>[] = [
    { key: 'fullName', header: 'Họ và Tên', render: p => <span className="font-medium text-[var(--color-text-main)]">{p.fullName}</span> },
    { key: 'email', header: 'Email', render: p => p.email || '—' },
    { key: 'phone', header: 'SĐT', render: p => p.phone || '—' },
    { key: 'passportNumber', header: 'Hộ chiếu/CCCD', render: p => p.passportNumber ? <span className="font-mono text-xs">{p.passportNumber}</span> : '—' },
    { key: '_actions', header: '', sortable: false, render: p => (
      <div className="flex gap-1 justify-end">
        <Button size="sm" variant="ghost" onClick={() => openModal(p)}><Pencil className="w-3.5 h-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={() => setDeleteId(p.id)} className="text-[var(--color-danger)]"><Trash2 className="w-3.5 h-3.5" /></Button>
      </div>
    )}
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Danh sách hành khách của tôi</h1>
        <Button onClick={() => openModal()} className="gap-1.5"><Plus className="w-4 h-4" /> Thêm hành khách</Button>
      </div>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={4} cols={5} /></div>
        ) : passengers && passengers.length > 0 ? (
          <DataTable columns={columns} data={passengers} pageSize={10} />
        ) : (
          <EmptyState
            icon={<Users className="w-12 h-12" />}
            title="Chưa có hành khách nào"
            description="Thêm hành khách để đặt vé cho họ."
            action={<Button onClick={() => openModal()}>+ Thêm hành khách</Button>}
          />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Sửa thông tin' : 'Thêm hành khách'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Họ và Tên (*)</label><input required className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Email</label><input type="email" className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Số điện thoại</label><input className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Passport / CCCD</label><input className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.passportNumber} onChange={e => setFormData({...formData, passportNumber: e.target.value})} /></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button><Button type="submit" disabled={createMut.isPending || updateMut.isPending}>Lưu</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa hành khách" message="Bạn có chắc muốn xóa hành khách này?" confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}

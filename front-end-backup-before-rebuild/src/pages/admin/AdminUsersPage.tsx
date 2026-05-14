import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, User } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Pencil, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: ['adminUsers'], queryFn: adminApi.getUsers });

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', role: 'USER' as string, password: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openEdit = (u: User) => {
    setEditUser(u);
    setFormData({ fullName: u.fullName, email: u.email, phone: u.phone || '', role: u.role, password: '' });
    setModalOpen(true);
  };

  const updateMut = useMutation({
    mutationFn: () => {
      const payload: any = { fullName: formData.fullName, email: formData.email, phone: formData.phone || null, role: formData.role };
      if (formData.password) payload.password = formData.password;
      return adminApi.updateUser(editUser!.id, payload);
    },
    onSuccess: () => { toast.success('Cập nhật thành công!'); setModalOpen(false); queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Lỗi cập nhật')
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => adminApi.deleteUser(id),
    onSuccess: () => { toast.success('Đã xóa người dùng.'); setDeleteId(null); queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); },
    onError: (e: any) => { toast.error(e.response?.data?.message || 'Lỗi xóa'); setDeleteId(null); }
  });

  const columns: Column<User>[] = [
    { key: 'id', header: 'ID' },
    { key: 'fullName', header: 'Họ và Tên', render: (u) => <span className="font-medium text-[var(--color-text-main)]">{u.fullName}</span> },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'SĐT', render: (u) => u.phone || '—' },
    { key: 'role', header: 'Vai trò', render: (u) => <StatusBadge status={u.role} /> },
    { key: 'createdAt', header: 'Ngày tạo', render: (u) => new Date(u.createdAt).toLocaleDateString('vi-VN') },
    {
      key: '_actions', header: '', sortable: false,
      render: (u) => (
        <div className="flex gap-1 justify-end">
          <Button size="sm" variant="ghost" onClick={() => openEdit(u)}><Pencil className="w-3.5 h-3.5" /></Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleteId(u.id)} className="text-[var(--color-danger)]"><Trash2 className="w-3.5 h-3.5" /></Button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Người dùng</h1>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={6} /></div> : <DataTable columns={columns} data={users ?? []} pageSize={10} />}
      </div>

      {/* Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editUser ? `Sửa — ${editUser.fullName}` : 'Thêm User'}>
        <form onSubmit={e => { e.preventDefault(); updateMut.mutate(); }} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Họ tên</label><input required className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Email</label><input required type="email" className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">SĐT</label><input className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Vai trò</label><select className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}><option value="USER">USER</option><option value="ADMIN">ADMIN</option></select></div>
          <div><label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Mật khẩu mới (để trống = giữ nguyên)</label><input type="password" className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button><Button type="submit" disabled={updateMut.isPending}>{updateMut.isPending ? 'Đang lưu...' : 'Lưu'}</Button></div>
        </form>
      </Modal>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa người dùng" message="Bạn có chắc muốn xóa người dùng này?" confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}

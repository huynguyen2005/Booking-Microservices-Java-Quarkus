import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, User } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Pencil, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const { data: users, isLoading } = useQuery<User[]>({ queryKey: ['adminUsers'], queryFn: adminApi.getUsers });
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', role: 'USER' as string });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openEdit = (u: User) => { setEditId(u.id); setForm({ fullName: u.fullName, email: u.email, phone: u.phone ?? '', password: '', role: u.role }); setEditModal(true); };

  const updateMut = useMutation({ mutationFn: (d: { id: number; payload: any }) => adminApi.updateUser(d.id, d.payload), onSuccess: () => { toast.success('Cập nhật user!'); setEditModal(false); qc.invalidateQueries({ queryKey: ['adminUsers'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Lỗi') });
  const deleteMut = useMutation({ mutationFn: adminApi.deleteUser, onSuccess: () => { toast.success('Đã xóa!'); setDeleteId(null); qc.invalidateQueries({ queryKey: ['adminUsers'] }); }, onError: (e: any) => { toast.error(e.response?.data?.message || e.response?.data || 'Lỗi'); setDeleteId(null); } });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    const payload: any = { fullName: form.fullName, email: form.email, phone: form.phone || null, role: form.role };
    if (form.password) payload.password = form.password;
    updateMut.mutate({ id: editId, payload });
  };

  const columns: Column<User>[] = [
    { key: 'id', header: 'ID' },
    { key: 'fullName', header: 'Họ tên', render: u => <span className="font-medium">{u.fullName}</span> },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'SĐT', render: u => u.phone ?? '—' },
    { key: 'role', header: 'Role', render: u => <StatusBadge status={u.role} /> },
    { key: 'createdAt', header: 'Ngày tạo', render: u => <span className="text-xs">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</span> },
    { key: '_actions', header: '', sortable: false, render: u => (
      <div className="flex gap-1 justify-end">
        <Button size="sm" variant="ghost" onClick={() => openEdit(u)}><Pencil className="w-3.5 h-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={() => setDeleteId(u.id)} className="text-[var(--color-danger)]"><Trash2 className="w-3.5 h-3.5" /></Button>
      </div>
    )}
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Quản lý Users</h1>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={6} /></div> : <DataTable columns={columns} data={users ?? []} pageSize={10} />}
      </div>
      <Modal open={editModal} onClose={() => setEditModal(false)} title="Sửa user">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Họ tên</label><input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">SĐT</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Mật khẩu mới (bỏ trống = không đổi)</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Role</label><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="USER">USER</option><option value="ADMIN">ADMIN</option></select></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setEditModal(false)}>Hủy</Button><Button type="submit" disabled={updateMut.isPending}>Lưu</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa user" message="Xóa user này?" confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}

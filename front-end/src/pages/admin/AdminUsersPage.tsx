import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, Role, User } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Pencil, Search, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState<Role | ''>('');

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['adminUsers', keyword, role],
    queryFn: () => (keyword || role ? adminApi.searchUsers({ keyword: keyword || undefined, role: role || undefined }) : adminApi.getUsers()),
  });

  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', role: 'USER' as Role });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openEdit = (u: User) => {
    setEditId(u.id);
    setForm({ fullName: u.fullName, email: u.email, phone: u.phone ?? '', password: '', role: u.role });
    setEditModal(true);
  };

  const updateMut = useMutation({
    mutationFn: (d: { id: number; payload: any }) => adminApi.updateUser(d.id, d.payload),
    onSuccess: () => {
      toast.success('C?p nh?t ngu?i dùng thành công');
      setEditModal(false);
      qc.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Có l?i x?y ra'),
  });

  const deleteMut = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      toast.success('Ðã xóa ngu?i dùng');
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || e.response?.data || 'Có l?i x?y ra');
      setDeleteId(null);
    },
  });

  const columns: Column<User>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'fullName', header: 'H? tên', render: u => <span className="font-medium">{u.fullName}</span> },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'SÐT', render: u => u.phone ?? '-' },
    { key: 'role', header: 'Vai trò', render: u => <StatusBadge status={u.role} /> },
    { key: 'createdAt', header: 'Ngày t?o', render: u => <span className="text-xs">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</span> },
    {
      key: '_actions',
      header: '',
      sortable: false,
      render: u => (
        <div className="flex gap-1 justify-end">
          <Button size="sm" variant="ghost" onClick={() => openEdit(u)}><Pencil className="w-3.5 h-3.5" /></Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleteId(u.id)} className="text-[var(--color-danger)]"><Trash2 className="w-3.5 h-3.5" /></Button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Qu?n lý ngu?i dùng</h1>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input className="pl-9 w-64" placeholder="Tìm theo tên/email" value={keyword} onChange={e => setKeyword(e.target.value)} />
          </div>
          <select value={role} onChange={e => setRole((e.target.value || '') as Role | '')} className="w-36">
            <option value="">T?t c? vai trò</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={6} /></div> : <DataTable columns={columns} data={users ?? []} pageSize={10} />}
      </div>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="C?p nh?t ngu?i dùng">
        <form onSubmit={e => {
          e.preventDefault();
          if (!editId) return;
          const payload: any = { fullName: form.fullName, email: form.email, phone: form.phone || null, role: form.role };
          if (form.password) payload.password = form.password;
          updateMut.mutate({ id: editId, payload });
        }} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">H? tên</label><input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">SÐT</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">M?t kh?u m?i (không b?t bu?c)</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Vai trò</label><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as Role })}><option value="USER">USER</option><option value="ADMIN">ADMIN</option></select></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setEditModal(false)}>H?y</Button><Button type="submit" disabled={updateMut.isPending}>Luu</Button></div>
        </form>
      </Modal>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMut.mutate(deleteId)} title="Xóa ngu?i dùng" message="B?n có ch?c ch?n mu?n xóa ngu?i dùng này?" confirmText="Xóa" variant="danger" loading={deleteMut.isPending} />
    </div>
  );
}


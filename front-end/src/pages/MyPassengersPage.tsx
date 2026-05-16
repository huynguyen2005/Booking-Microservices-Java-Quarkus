import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { passengerApi, Passenger } from '../api/endpoints';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';
import { Plus, Pencil, Trash2, Users, Loader2, Search, Mail, Phone, IdCard } from 'lucide-react';

export default function MyPassengersPage() {
  const qc = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const { data: passengers, isLoading } = useQuery<Passenger[]>({
    queryKey: ['myPassengers', keyword],
    queryFn: () => keyword ? passengerApi.search(keyword) : passengerApi.getMyPassengers(),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', passportNumber: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openModal = (p?: Passenger) => {
    if (p) {
      setEditingId(p.id);
      setForm({
        fullName: p.fullName ?? '',
        email: p.email ?? '',
        phone: p.phone ?? '',
        passportNumber: p.passportNumber ?? '',
      });
    } else {
      setEditingId(null);
      setForm({ fullName: '', email: '', phone: '', passportNumber: '' });
    }
    setModalOpen(true);
  };

  const createMut = useMutation({
    mutationFn: passengerApi.createPassenger,
    onSuccess: () => {
      toast.success('Thêm hành khách thành công!');
      setModalOpen(false);
      qc.invalidateQueries({ queryKey: ['myPassengers'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Lỗi'),
  });

  const updateMut = useMutation({
    mutationFn: (d: { id: number; payload: Partial<Passenger> }) => passengerApi.updatePassenger(d.id, d.payload),
    onSuccess: () => {
      toast.success('Cập nhật thành công!');
      setModalOpen(false);
      qc.invalidateQueries({ queryKey: ['myPassengers'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Lỗi'),
  });

  const deleteMut = useMutation({
    mutationFn: passengerApi.deletePassenger,
    onSuccess: () => {
      toast.success('Đã xóa hành khách!');
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ['myPassengers'] });
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || e.response?.data || 'Lỗi');
      setDeleteId(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) updateMut.mutate({ id: editingId, payload: form });
    else createMut.mutate(form);
  };

  const filtered = useMemo(() => passengers ?? [], [passengers]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Hành khách của tôi</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              className="pl-9 w-56 text-sm"
              placeholder="Tìm kiếm tên/email/SĐT..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <Button onClick={() => openModal()} className="gap-1.5"><Plus className="w-4 h-4" /> Thêm</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <Users className="w-12 h-12 mx-auto text-[var(--color-text-muted)] opacity-30 mb-4" />
          <h3 className="text-lg font-semibold">Chưa có hành khách</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-4">Thêm hành khách để đặt vé nhanh hơn.</p>
          <Button onClick={() => openModal()}>+ Thêm hành khách</Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(p => (
            <div key={p.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-lg text-[var(--color-text-main)]">{p.fullName ?? 'Không tên'}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Mã hành khách: #{p.id}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openModal(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteId(p.id)} className="text-[var(--color-danger)]"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-[var(--color-text-main)]">
                  <Mail className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Email</p>
                    <p className="font-medium break-all">{p.email || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-main)]">
                  <Phone className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Số điện thoại</p>
                    <p className="font-medium">{p.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-main)]">
                  <IdCard className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Hộ chiếu / CCCD</p>
                    <p className="font-medium">{p.passportNumber || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Sửa hành khách' : 'Thêm hành khách'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Họ tên <span className="text-[var(--color-danger)]">*</span></label><input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">SĐT</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Passport / CCCD</label><input value={form.passportNumber} onChange={e => setForm({ ...form, passportNumber: e.target.value })} /></div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button><Button type="submit" disabled={createMut.isPending || updateMut.isPending}>Lưu</Button></div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMut.mutate(deleteId)}
        title="Xóa hành khách"
        message="Bạn có chắc chắn muốn xóa hành khách này?"
        confirmText="Xóa"
        variant="danger"
        loading={deleteMut.isPending}
      />
    </div>
  );
}

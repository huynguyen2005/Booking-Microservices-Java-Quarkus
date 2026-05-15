import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, userApi, User } from '../api/endpoints';
import { useAuth } from '../lib/auth';
import { StatusBadge } from '../components/ui/StatusBadge';
import { toast } from '../components/ui/Toast';
import { Link } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, Calendar, Upload, Loader2, Ticket, CreditCard, Users, ClipboardCheck } from 'lucide-react';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const qc = useQueryClient();
  const { data: me, isLoading } = useQuery<User>({ queryKey: ['me'], queryFn: authApi.me });
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadMut = useMutation({
    mutationFn: (file: File) => userApi.uploadAvatar(file),
    onSuccess: () => {
      toast.success('Avatar đã cập nhật');
      qc.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data || 'Upload thất bại'),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
      toast.error('Chỉ hỗ trợ jpeg/png/webp');
      return;
    }
    if (f.size > MAX_AVATAR_SIZE) {
      toast.error('Kích thước tối đa 5MB');
      return;
    }
    uploadMut.mutate(f);
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>;

  const u = me || authUser;
  if (!u) return null;

  const quickLinks = [
    { to: '/my-bookings', icon: Ticket, label: 'Đặt chỗ', desc: 'Xem booking của bạn' },
    { to: '/my-payments', icon: CreditCard, label: 'Thanh toán', desc: 'Quản lý thanh toán' },
    { to: '/my-tickets', icon: Ticket, label: 'Vé máy bay', desc: 'Xem vé đã phát hành' },
    { to: '/my-passengers', icon: Users, label: 'Hành khách', desc: 'Quản lý hành khách' },
    { to: '/checkin', icon: ClipboardCheck, label: 'Check-in', desc: 'Check-in trực tuyến' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Hồ sơ cá nhân</h1>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center overflow-hidden border-2 border-[var(--color-primary)]">
              {u.avatarUrl ? <img src={u.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <UserIcon className="w-10 h-10 text-[var(--color-primary)]" />}
            </div>
            <button aria-label="Upload avatar" onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[var(--color-primary-hover)] transition-colors">
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-main)]">{u.fullName}</h2>
            <div className="flex items-center gap-2 mt-1"><StatusBadge status={u.role} /></div>
          </div>
        </div>

        <div className="grid gap-4 text-sm">
          <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-subtle)] rounded-md"><Mail className="w-4 h-4 text-[var(--color-text-muted)]" /><div><p className="text-xs text-[var(--color-text-muted)]">Email</p><p className="font-medium">{u.email}</p></div></div>
          <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-subtle)] rounded-md"><Phone className="w-4 h-4 text-[var(--color-text-muted)]" /><div><p className="text-xs text-[var(--color-text-muted)]">Số điện thoại</p><p className="font-medium">{u.phone ?? 'Chưa cập nhật'}</p></div></div>
          <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-subtle)] rounded-md"><Calendar className="w-4 h-4 text-[var(--color-text-muted)]" /><div><p className="text-xs text-[var(--color-text-muted)]">Ngày tạo</p><p className="font-medium">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</p></div></div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {quickLinks.map(l => (
          <Link key={l.to} to={l.to} className="flex items-center gap-3 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-primary)] hover:shadow-sm transition-all">
            <l.icon className="w-5 h-5 text-[var(--color-primary)]" />
            <div><p className="font-medium text-sm">{l.label}</p><p className="text-xs text-[var(--color-text-muted)]">{l.desc}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}

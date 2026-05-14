import { useAuth } from '../lib/auth';
import { User, Ticket, CreditCard, Users, Plane, Camera } from 'lucide-react';
import { useRef, useState } from 'react';
import { userApi } from '../api/endpoints';
import { toast } from '../components/ui/Toast';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File quá lớn. Tối đa 5MB.');
      return;
    }
    try {
      setUploading(true);
      await userApi.uploadAvatar(file);
      toast.success('Cập nhật ảnh đại diện thành công! Tải lại trang để xem.');
      // Reload to reflect new avatar from /me
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Tải ảnh thất bại.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center text-[var(--color-text-muted)]">Vui lòng đăng nhập để xem hồ sơ.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col items-center">
            <div className="relative group mb-4">
              <div className="h-24 w-24 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-[var(--color-primary)]" />
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            {uploading && <p className="text-xs text-[var(--color-primary)] animate-pulse-subtle mb-2">Đang tải lên...</p>}
            <h2 className="text-xl font-bold text-[var(--color-text-main)]">{user.fullName}</h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">{user.email}</p>
            
            <div className="w-full flex flex-col gap-1.5">
              <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-white text-sm font-medium">
                <User className="w-4 h-4" /> Thông tin cá nhân
              </Link>
              <Link to="/my-bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-subtle)] text-sm transition-colors">
                <Ticket className="w-4 h-4" /> Lịch sử đặt chỗ
              </Link>
              <Link to="/my-passengers" className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-subtle)] text-sm transition-colors">
                <Users className="w-4 h-4" /> Hành khách của tôi
              </Link>
              <Link to="/my-payments" className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-subtle)] text-sm transition-colors">
                <CreditCard className="w-4 h-4" /> Lịch sử thanh toán
              </Link>
              <Link to="/my-tickets" className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-subtle)] text-sm transition-colors">
                <Plane className="w-4 h-4" /> Vé máy bay
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] text-sm transition-colors mt-3 w-full"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-sm p-6 md:p-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-[var(--color-text-main)]">Thông tin cá nhân</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Họ và tên</label>
                  <p className="text-[var(--color-text-main)] font-semibold border-b border-[var(--color-border)] pb-2">{user.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Email</label>
                  <p className="text-[var(--color-text-main)] font-semibold border-b border-[var(--color-border)] pb-2">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Số điện thoại</label>
                  <p className="text-[var(--color-text-main)] font-semibold border-b border-[var(--color-border)] pb-2">{user.phone || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Vai trò</label>
                  <p className="text-[var(--color-text-main)] font-semibold border-b border-[var(--color-border)] pb-2">{user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Ngày tham gia</label>
                  <p className="text-[var(--color-text-main)] font-semibold border-b border-[var(--color-border)] pb-2">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

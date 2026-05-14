import { Link, useNavigate } from 'react-router-dom';
import { Plane, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { authApi } from '../api/endpoints';
import { useAuth } from '../lib/auth';
import { toast } from '../components/ui/Toast';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setErrorMsg('');
      const res = await authApi.login(data);
      login(res.token, res.user);
      toast.success('Đăng nhập thành công!');
      if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Đăng nhập thất bại.';
      setErrorMsg(typeof msg === 'string' ? msg : 'Đăng nhập thất bại.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--color-primary)] to-blue-700 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <Plane className="h-10 w-10" />
            <span className="text-3xl font-bold tracking-tight">SkyFlow</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Đặt vé máy bay<br />nhanh chóng & tiện lợi
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Tìm kiếm hàng nghìn chuyến bay, so sánh giá, đặt vé chỉ trong vài phút. Trải nghiệm đặt vé hiện đại cùng SkyFlow.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-[var(--color-bg)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Plane className="h-7 w-7 text-[var(--color-primary)]" />
            <span className="text-2xl font-bold text-[var(--color-primary)]">SkyFlow</span>
          </div>

          <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-1">Đăng nhập</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">Chào mừng trở lại! Nhập thông tin để tiếp tục.</p>

          {errorMsg && (
            <div className="mb-6 p-3 bg-[var(--color-danger-soft)] text-[var(--color-danger)] border border-[var(--color-danger)] border-opacity-20 rounded-[var(--radius-sm)] text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-main)] mb-1.5">Email</label>
              <input
                id="email"
                {...register('email')}
                type="email"
                placeholder="user@example.com"
                autoComplete="email"
                className={errors.email ? 'border-[var(--color-danger)]' : ''}
              />
              {errors.email && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-main)] mb-1.5">Mật khẩu</label>
              <input
                id="password"
                {...register('password')}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className={errors.password ? 'border-[var(--color-danger)]' : ''}
              />
              {errors.password && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[var(--color-primary)] text-white font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin-slow" />}
              {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

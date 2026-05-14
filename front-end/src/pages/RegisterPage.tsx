import { Link, useNavigate } from 'react-router-dom';
import { Plane, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { authApi } from '../api/endpoints';
import { toast } from '../components/ui/Toast';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Tên ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  phone: z.string().optional(),
});
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setErrorMsg('');
      await authApi.register(data);
      toast.success('Đăng ký thành công! Đang chuyển đến đăng nhập...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Đăng ký thất bại.';
      setErrorMsg(typeof msg === 'string' ? msg : 'Đăng ký thất bại.');
      toast.error(typeof msg === 'string' ? msg : 'Đăng ký thất bại.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-[var(--color-primary)] items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <Plane className="h-10 w-10" />
            <span className="text-3xl font-bold tracking-tight">SkyFlow</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Tạo tài khoản<br />bắt đầu hành trình
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Đăng ký miễn phí để đặt vé, quản lý hành khách, theo dõi thanh toán và check-in trực tuyến.
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

          <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-1">Tạo tài khoản</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">Điền thông tin bên dưới để đăng ký.</p>

          {errorMsg && (
            <div className="mb-6 p-3 bg-[var(--color-danger-soft)] text-[var(--color-danger)] border border-[var(--color-danger)] border-opacity-20 rounded-[var(--radius-sm)] text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[var(--color-text-main)] mb-1.5">
                Họ và tên <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                id="fullName"
                {...register('fullName')}
                type="text"
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                className={errors.fullName ? 'border-[var(--color-danger)]' : ''}
              />
              {errors.fullName && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.fullName.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-main)] mb-1.5">
                Email <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                id="email"
                {...register('email')}
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
                className={errors.email ? 'border-[var(--color-danger)]' : ''}
              />
              {errors.email && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text-main)] mb-1.5">
                Số điện thoại
              </label>
              <input
                id="phone"
                {...register('phone')}
                type="tel"
                placeholder="0901234567"
                autoComplete="tel"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-main)] mb-1.5">
                Mật khẩu <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                id="password"
                {...register('password')}
                type="password"
                placeholder="Ít nhất 6 ký tự"
                autoComplete="new-password"
                className={errors.password ? 'border-[var(--color-danger)]' : ''}
              />
              {errors.password && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[var(--color-primary)] text-white font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin-slow" />}
              {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

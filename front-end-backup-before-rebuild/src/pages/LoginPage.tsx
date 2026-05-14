import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { http } from '../lib/http';
import { useAuth, UserResponse } from '../lib/auth';

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
      const res = await http.post<{token: string, user: UserResponse}>('/api/auth/login', data);
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.response?.data || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-8">
        <div className="flex flex-col items-center mb-8">
          <Plane className="h-10 w-10 text-[var(--color-primary)] mb-4" />
          <h1 className="text-2xl font-bold text-[var(--color-text-main)] text-center">Đăng nhập SkyFlow</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--color-text-main)]">Email</label>
            <input 
              {...register('email')}
              type="email" 
              placeholder="user@example.com" 
              className={`w-full h-10 px-3 rounded-[var(--radius-sm)] border focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] text-sm ${errors.email ? 'border-red-500' : 'border-[var(--color-border)]'}`}
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--color-text-main)]">Mật khẩu</label>
            <input 
              {...register('password')}
              type="password" 
              placeholder="••••••••" 
              className={`w-full h-10 px-3 rounded-[var(--radius-sm)] border focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] text-sm ${errors.password ? 'border-red-500' : 'border-[var(--color-border)]'}`}
            />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>

          <Button type="submit" size="lg" className="w-full mt-2 font-bold" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

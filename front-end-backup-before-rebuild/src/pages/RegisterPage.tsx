import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { http } from '../lib/http';
import { toast } from '../components/ui/Toast';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Tên quá ngắn'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại ít nhất 9 ký tự').regex(/^[0-9+\-\s()]+$/, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
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
      await http.post('/api/auth/register', { ...data, role: 'USER' });
      toast.success('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Đăng ký thất bại.';
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-8 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <Plane className="h-10 w-10 text-[var(--color-primary)] mb-4" />
          <h1 className="text-2xl font-bold text-[var(--color-text-main)] text-center">Tạo tài khoản SkyFlow</h1>
        </div>

        {errorMsg && <div className="mb-4 p-3 bg-[var(--color-danger-soft)] text-[var(--color-danger)] rounded-md text-sm">{errorMsg}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--color-text-main)]">Họ và tên</label>
            <input {...register('fullName')} type="text" className="w-full h-10 px-3 rounded-[var(--radius-sm)] border mt-1" placeholder="Nguyễn Văn A" />
            {errors.fullName && <span className="text-xs text-[var(--color-danger)]">{errors.fullName.message}</span>}
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--color-text-main)]">Email</label>
            <input {...register('email')} type="email" className="w-full h-10 px-3 rounded-[var(--radius-sm)] border mt-1" placeholder="email@example.com" />
            {errors.email && <span className="text-xs text-[var(--color-danger)]">{errors.email.message}</span>}
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--color-text-main)]">Số điện thoại</label>
            <input {...register('phone')} type="tel" className="w-full h-10 px-3 rounded-[var(--radius-sm)] border mt-1" placeholder="0901234567" />
            {errors.phone && <span className="text-xs text-[var(--color-danger)]">{errors.phone.message}</span>}
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--color-text-main)]">Mật khẩu</label>
            <input {...register('password')} type="password" className="w-full h-10 px-3 rounded-[var(--radius-sm)] border mt-1" placeholder="••••••" />
            {errors.password && <span className="text-xs text-[var(--color-danger)]">{errors.password.message}</span>}
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-[var(--color-primary)] font-semibold">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

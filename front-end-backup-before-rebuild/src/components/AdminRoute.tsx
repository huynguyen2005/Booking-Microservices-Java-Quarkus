import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function AdminRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Đang tải...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

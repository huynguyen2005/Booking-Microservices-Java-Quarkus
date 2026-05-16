import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { DarkModeToggle } from '../components/ui/DarkModeToggle';
import { Plane, LayoutDashboard, Users, MapPin, PlaneTakeoff, Armchair, Ticket, CreditCard, LogOut, ClipboardCheck, UserCheck, BookOpen } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname.includes(path);

  const navClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${isActive(path) ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-main)] hover:bg-[var(--color-surface-subtle)]'}`;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] hidden md:flex flex-col fixed inset-y-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)] gap-2">
          <Plane className="h-6 w-6 text-[var(--color-primary)]" />
          <Link to="/admin/dashboard" className="text-xl font-bold text-[var(--color-primary)]">SkyFlow Admin</Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
          <Link to="/admin/dashboard" className={navClass('/dashboard')}>
            <LayoutDashboard className="w-4 h-4" /> Tổng quan
          </Link>
          <Link to="/admin/users" className={navClass('/users')}>
            <Users className="w-4 h-4" /> Người dùng
          </Link>

          <div className="mt-5 mb-2 px-3 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Hoạt động bay</div>
          <Link to="/admin/airports" className={navClass('/airports')}>
            <MapPin className="w-4 h-4" /> Sân bay
          </Link>
          <Link to="/admin/airplanes" className={navClass('/airplanes')}>
            <Plane className="w-4 h-4" /> Máy bay
          </Link>
          <Link to="/admin/flights" className={navClass('/flights')}>
            <PlaneTakeoff className="w-4 h-4" /> Chuyến bay
          </Link>
          <Link to="/admin/seats" className={navClass('/seats')}>
            <Armchair className="w-4 h-4" /> Ghế ngồi
          </Link>

          <div className="mt-5 mb-2 px-3 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Bán vé & Booking</div>
          <Link to="/admin/passengers" className={navClass('/passengers')}>
            <UserCheck className="w-4 h-4" /> Hành khách
          </Link>
          <Link to="/admin/bookings" className={navClass('/bookings')}>
            <BookOpen className="w-4 h-4" /> Đặt chỗ
          </Link>
          <Link to="/admin/payments" className={navClass('/payments')}>
            <CreditCard className="w-4 h-4" /> Thanh toán
          </Link>
          <Link to="/admin/tickets" className={navClass('/tickets')}>
            <Ticket className="w-4 h-4" /> Vé
          </Link>
          <Link to="/admin/checkins" className={navClass('/checkins')}>
            <ClipboardCheck className="w-4 h-4" /> Check-in
          </Link>
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] mb-1">
            ← Trang chủ
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-colors">
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
          <h2 className="text-lg font-bold text-[var(--color-text-main)]">Trang quản trị</h2>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <div className="h-8 w-8 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center">
              <Users className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--color-text-main)]">{user?.fullName ?? 'Admin'}</span>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

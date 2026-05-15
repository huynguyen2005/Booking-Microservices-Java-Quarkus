import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Plane, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { DarkModeToggle } from '../components/ui/DarkModeToggle';
import { useState, useRef, useEffect } from 'react';

export default function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      {/* Top Navigation */}
      <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-[var(--color-primary)]" />
            <Link to="/" className="text-xl font-bold text-[var(--color-primary)] tracking-tight">SkyFlow</Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/flights" className="text-[var(--color-text-main)] hover:text-[var(--color-primary)] font-medium text-sm transition-colors">
              Chuyến bay
            </Link>
            <Link to="/checkin" className="text-[var(--color-text-main)] hover:text-[var(--color-primary)] font-medium text-sm transition-colors">
              Check-in
            </Link>
            <DarkModeToggle />

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-[var(--color-primary)]" />
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.fullName}</span>
                  <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] py-1 animate-fade-in z-50">
                    <div className="px-4 py-3 border-b border-[var(--color-border)]">
                      <p className="text-sm font-semibold text-[var(--color-text-main)]">{user.fullName}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{user.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2.5 text-sm hover:bg-[var(--color-surface-subtle)] transition-colors" onClick={() => setMenuOpen(false)}>Hồ sơ</Link>
                    <Link to="/my-bookings" className="block px-4 py-2.5 text-sm hover:bg-[var(--color-surface-subtle)] transition-colors" onClick={() => setMenuOpen(false)}>Đặt chỗ</Link>
                    <Link to="/my-passengers" className="block px-4 py-2.5 text-sm hover:bg-[var(--color-surface-subtle)] transition-colors" onClick={() => setMenuOpen(false)}>Hành khách</Link>
                    <Link to="/my-payments" className="block px-4 py-2.5 text-sm hover:bg-[var(--color-surface-subtle)] transition-colors" onClick={() => setMenuOpen(false)}>Thanh toán</Link>
                    <Link to="/my-tickets" className="block px-4 py-2.5 text-sm hover:bg-[var(--color-surface-subtle)] transition-colors" onClick={() => setMenuOpen(false)}>Vé máy bay</Link>
                    {user.role === 'ADMIN' && (
                      <Link to="/admin/dashboard" className="block px-4 py-2.5 text-sm text-[var(--color-primary)] font-medium hover:bg-[var(--color-surface-subtle)] transition-colors border-t border-[var(--color-border)]" onClick={() => setMenuOpen(false)}>Quản trị</Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-colors border-t border-[var(--color-border)] flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-subtle)] transition-colors">
                  Đăng nhập
                </Link>
                <Link to="/register" className="text-sm font-medium px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-sm)] hover:bg-[var(--color-primary-hover)] transition-colors">
                  Đăng ký
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[var(--color-text-muted)] text-sm">
          &copy; {new Date().getFullYear()} SkyFlow Airlines. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

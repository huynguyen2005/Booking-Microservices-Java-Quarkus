import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-fade-in">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 sm:p-12 text-center">
        <Plane className="w-10 h-10 mx-auto text-[var(--color-primary)] mb-4" />
        <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-3">SkyFlow Booking</h1>
        <p className="text-[var(--color-text-muted)] mb-6">Tìm kiếm chuyến bay, đặt vé và quản lý hành trình của bạn.</p>
        <Link to="/flights" className="inline-flex items-center px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
          Đi đến trang chuyến bay
        </Link>
      </div>
    </div>
  );
}

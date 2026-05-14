import { Button } from '../components/ui/Button';
import { Plane, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { flightApi, Flight, Airport } from '../api/endpoints';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useMemo, useState } from 'react';

export default function FlightsListPage() {
  const { data: flights, isLoading, isError } = useQuery<Flight[]>({
    queryKey: ['flights'],
    queryFn: flightApi.getFlights
  });

  const { data: airports } = useQuery<Airport[]>({
    queryKey: ['airports'],
    queryFn: flightApi.getAirports,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const airportMap = useMemo(() => {
    const map: Record<number, Airport> = {};
    airports?.forEach(a => { map[a.id] = a; });
    return map;
  }, [airports]);

  const getAirportLabel = (id: number) => {
    const a = airportMap[id];
    return a ? `${a.city} (${a.code})` : `#${id}`;
  };

  const filteredFlights = useMemo(() => {
    if (!flights) return [];
    let list = [...flights];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(f => {
        const dep = airportMap[f.departureAirportId];
        const arr = airportMap[f.arrivalAirportId];
        return f.flightNumber.toLowerCase().includes(lower) ||
          dep?.code.toLowerCase().includes(lower) ||
          dep?.city.toLowerCase().includes(lower) ||
          arr?.code.toLowerCase().includes(lower) ||
          arr?.city.toLowerCase().includes(lower);
      });
    }
    if (statusFilter) {
      list = list.filter(f => f.status === statusFilter);
    }
    return list;
  }, [flights, searchTerm, statusFilter, airportMap]);

  const statuses = useMemo(() => {
    if (!flights) return [];
    return [...new Set(flights.map(f => f.status))];
  }, [flights]);

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex gap-8 animate-fade-in">
      {/* Sidebar Filter */}
      <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-5">
          <h3 className="font-bold text-lg mb-4 text-[var(--color-text-main)] flex items-center gap-2">
            <Filter className="w-5 h-5" /> Bộ lọc
          </h3>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-[var(--color-text-main)] mb-2 block">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Mã chuyến bay, sân bay..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm"
                />
              </div>
            </div>
            
            <hr className="border-[var(--color-border)]" />
            
            <div>
              <label className="text-sm font-semibold text-[var(--color-text-main)] mb-2 block">Trạng thái</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full h-9 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm"
              >
                <option value="">Tất cả</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {(searchTerm || statusFilter) && (
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter(''); }}
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6">
        {/* Top Search summary */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-lg text-[var(--color-text-main)]">Chuyến bay</span>
            <span className="text-sm text-[var(--color-text-muted)]">
              {filteredFlights.length} kết quả
              {searchTerm && ` cho "${searchTerm}"`}
            </span>
          </div>
          {/* Mobile search */}
          <div className="lg:hidden flex gap-2 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm"
              />
            </div>
          </div>
        </div>

        {/* Flight Cards */}
        <div className="flex flex-col gap-4">
          {isLoading && <TableSkeleton rows={5} cols={4} />}
          {isError && (
            <div className="p-8 text-center text-[var(--color-danger)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
              Lỗi tải dữ liệu. Vui lòng thử lại.
            </div>
          )}
          
          {!isLoading && filteredFlights.length === 0 && (
            <EmptyState
              icon={<Plane className="w-12 h-12" />}
              title="Không tìm thấy chuyến bay"
              description="Thử thay đổi bộ lọc để xem thêm kết quả."
            />
          )}

          {filteredFlights.map((flight) => (
            <div key={flight.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-5 shadow-sm hover:shadow-[var(--shadow-md)] transition-all hover:-translate-y-0.5 flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div className="flex gap-4 items-center w-64 shrink-0">
                <div className="h-12 w-12 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center shrink-0">
                  {flight.imageUrl ? (
                    <img src={flight.imageUrl} alt="" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <Plane className="h-6 w-6 text-[var(--color-primary)]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[var(--color-text-main)]">{flight.flightNumber}</h4>
                  <StatusBadge status={flight.status} />
                </div>
              </div>
              
              <div className="flex items-center gap-6 justify-center flex-1">
                <div className="text-right">
                  <p className="font-bold text-xl text-[var(--color-text-main)]">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{getAirportLabel(flight.departureAirportId)}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{new Date(flight.departureTime).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="flex flex-col items-center px-4">
                  <div className="w-24 h-[1px] bg-[var(--color-border)] relative my-3">
                    <Plane className="h-3 w-3 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[var(--color-text-muted)]" />
                  </div>
                  <p className="text-xs text-[var(--color-success)] font-medium">Bay thẳng</p>
                </div>
                <div>
                  <p className="font-bold text-xl text-[var(--color-text-main)]">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{getAirportLabel(flight.arrivalAirportId)}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{new Date(flight.arrivalTime).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 border-t md:border-t-0 md:border-l border-[var(--color-border)] pt-4 md:pt-0 md:pl-6 w-32 shrink-0">
                <Link to={`/flights/${flight.id}`}>
                  <Button>Đặt vé ngay</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

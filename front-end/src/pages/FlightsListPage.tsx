import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { flightApi, Flight, Airport } from '../api/endpoints';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Plane, ArrowRight, Search, MapPin, Clock, Loader2 } from 'lucide-react';

type SortBy = 'departureAirportId' | 'arrivalAirportId' | 'airplaneId' | 'flightNumber' | 'departureTime' | 'arrivalTime';
type SortDir = 'asc' | 'desc';

export default function FlightsListPage() {
  const [filters, setFilters] = useState({
    keyword: '',
    departureAirportId: '',
    arrivalAirportId: '',
    departureFrom: '',
    departureTo: '',
    sortBy: 'departureTime' as SortBy,
    sortDir: 'asc' as SortDir,
  });

  const { data: airports } = useQuery<Airport[]>({ queryKey: ['airports'], queryFn: flightApi.getAirports });
  const { data: allFlights, isLoading } = useQuery<Flight[]>({ queryKey: ['flights'], queryFn: flightApi.getFlights });

  const airportMap = useMemo(() => {
    const m: Record<number, Airport> = {};
    airports?.forEach(a => {
      m[a.id] = a;
    });
    return m;
  }, [airports]);

  const flights = useMemo(() => {
    const list = allFlights ?? [];
    const keyword = filters.keyword.trim().toLowerCase();

    const filtered = list.filter(f => {
      const dep = f.departureAirportId ? airportMap[f.departureAirportId] : null;
      const arr = f.arrivalAirportId ? airportMap[f.arrivalAirportId] : null;

      const matchKeyword = !keyword || [
        f.flightNumber,
        dep?.code,
        dep?.name,
        dep?.city,
        arr?.code,
        arr?.name,
        arr?.city,
      ].some(v => (v ?? '').toLowerCase().includes(keyword));

      const matchDeparture = !filters.departureAirportId || f.departureAirportId === Number(filters.departureAirportId);
      const matchArrival = !filters.arrivalAirportId || f.arrivalAirportId === Number(filters.arrivalAirportId);
      const depTime = f.departureTime ? new Date(f.departureTime).getTime() : NaN;
      const depFrom = filters.departureFrom ? new Date(filters.departureFrom).getTime() : null;
      const depTo = filters.departureTo ? new Date(filters.departureTo).getTime() : null;

      const matchDepartureTime = (depFrom === null || (!Number.isNaN(depTime) && depTime >= depFrom)) && (depTo === null || (!Number.isNaN(depTime) && depTime <= depTo));

      return matchKeyword && matchDeparture && matchArrival && matchDepartureTime;
    });

    const sorted = [...filtered].sort((a, b) => {
      const readValue = (f: Flight) => {
        switch (filters.sortBy) {
          case 'departureAirportId':
          case 'arrivalAirportId':
          case 'airplaneId':
            return f[filters.sortBy] ?? 0;
          case 'flightNumber':
            return (f.flightNumber ?? '').toUpperCase();
          case 'departureTime':
            return f.departureTime ? new Date(f.departureTime).getTime() : Number.MAX_SAFE_INTEGER;
          case 'arrivalTime':
            return f.arrivalTime ? new Date(f.arrivalTime).getTime() : Number.MAX_SAFE_INTEGER;
          default:
            return 0;
        }
      };

      const av = readValue(a);
      const bv = readValue(b);
      if (typeof av === 'string' && typeof bv === 'string') {
        return filters.sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      const an = Number(av);
      const bn = Number(bv);
      return filters.sortDir === 'asc' ? an - bn : bn - an;
    });

    return sorted;
  }, [allFlights, airportMap, filters]);

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-blue-700 text-white py-12 sm:py-16 px-4 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 sm:mb-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="w-8 h-8" />
            <h1 className="text-3xl sm:text-4xl font-bold">Tìm chuyến bay</h1>
          </div>
          <p className="text-blue-100 mb-8 text-lg">Tìm kiếm nhanh và lọc theo hành trình, thời gian, sắp xếp</p>

          <div className="bg-white/10 p-3 rounded-[var(--radius-lg)] backdrop-blur-sm space-y-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={filters.keyword}
                  onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                  placeholder="Tìm theo mã chuyến bay, sân bay, thành phố..."
                  className="w-full h-12 pl-12 pr-4 rounded-[var(--radius-md)] text-[var(--color-text-main)]"
                />
              </div>
              <select value={filters.departureAirportId} onChange={e => setFilters(prev => ({ ...prev, departureAirportId: e.target.value }))}>
                <option value="">Sân bay khởi hành</option>
                {airports?.map(a => <option key={a.id} value={a.id}>{a.code} - {a.city}</option>)}
              </select>
              <select value={filters.arrivalAirportId} onChange={e => setFilters(prev => ({ ...prev, arrivalAirportId: e.target.value }))}>
                <option value="">Sân bay đến</option>
                {airports?.map(a => <option key={a.id} value={a.id}>{a.code} - {a.city}</option>)}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input type="datetime-local" value={filters.departureFrom} onChange={e => setFilters(prev => ({ ...prev, departureFrom: e.target.value }))} placeholder="Khởi hành từ" />
              <input type="datetime-local" value={filters.departureTo} onChange={e => setFilters(prev => ({ ...prev, departureTo: e.target.value }))} placeholder="Khởi hành đến" />
              <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                <div className="h-12 rounded-[var(--radius-md)] bg-white text-[var(--color-primary)] flex items-center justify-center text-base font-bold shadow-sm">
                  {flights.length} kết quả
                </div>
                <button
                  type="button"
                  onClick={() => setFilters({ keyword: '', departureAirportId: '', arrivalAirportId: '', departureFrom: '', departureTo: '', sortBy: 'departureTime', sortDir: 'asc' })}
                  className="h-12 rounded-[var(--radius-md)] bg-amber-300 text-slate-900 font-semibold hover:bg-amber-200 transition-colors shadow-sm"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <select value={filters.sortBy} onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as SortBy }))}>
                <option value="departureTime">Sắp xếp theo: Giờ khởi hành</option>
                <option value="arrivalTime">Sắp xếp theo: Giờ đến</option>
                <option value="flightNumber">Sắp xếp theo: Mã chuyến bay</option>
                <option value="departureAirportId">Sắp xếp theo: Sân bay khởi hành</option>
                <option value="arrivalAirportId">Sắp xếp theo: Sân bay đến</option>
                <option value="airplaneId">Sắp xếp theo: Máy bay</option>
              </select>
              <select value={filters.sortDir} onChange={e => setFilters(prev => ({ ...prev, sortDir: e.target.value as SortDir }))}>
                <option value="asc">Thứ tự: Tăng dần</option>
                <option value="desc">Thứ tự: Giảm dần</option>
              </select>
              <div className="hidden lg:block" />
              <div className="hidden lg:block" />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>
      ) : flights.length === 0 ? (
        <div className="text-center py-20">
          <Plane className="w-12 h-12 mx-auto text-[var(--color-text-muted)] opacity-30 mb-4" />
          <h3 className="text-lg font-semibold text-[var(--color-text-main)]">Không tìm thấy chuyến bay</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Thử đổi bộ lọc</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {flights.map(f => {
            const dep = f.departureAirportId ? airportMap[f.departureAirportId] : null;
            const arr = f.arrivalAirportId ? airportMap[f.arrivalAirportId] : null;
            return (
              <Link key={f.id} to={`/flights/${f.id}`} className="block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:shadow-[var(--shadow-md)] transition-all hover:border-[var(--color-primary)] group">
                <div className="flex flex-col sm:flex-row items-stretch">
                  {f.imageUrl && <img src={f.imageUrl} alt={`Ảnh chuyến bay ${f.flightNumber ?? ''}`} className="w-full sm:w-40 h-32 sm:h-auto object-cover rounded-t-[var(--radius-md)] sm:rounded-l-[var(--radius-md)] sm:rounded-tr-none" />}
                  <div className="flex-1 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-[var(--color-primary)]">{f.flightNumber ?? 'Không rõ'}</span>
                        <StatusBadge status={f.status} />
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="text-center">
                          <p className="font-bold text-lg">{dep?.code ?? '?'}</p>
                          <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-0.5"><MapPin className="w-3 h-3" />{dep?.city ?? ''}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                        <div className="text-center">
                          <p className="font-bold text-lg">{arr?.code ?? '?'}</p>
                          <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-0.5"><MapPin className="w-3 h-3" />{arr?.city ?? ''}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-[var(--color-text-muted)]">
                      {f.departureTime && <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /><span>{new Date(f.departureTime).toLocaleString('vi-VN')}</span></div>}
                      <div className="mt-1 font-semibold text-[var(--color-primary)]">
                        {Number(f.basePrice ?? 0).toLocaleString('vi-VN')} {(f.currency ?? 'VND').toUpperCase()}
                      </div>
                    </div>
                    <div className="sm:ml-auto">
                      <span className="inline-flex items-center gap-1 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-[var(--radius-sm)] group-hover:bg-[var(--color-primary-hover)] transition-colors">
                        Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

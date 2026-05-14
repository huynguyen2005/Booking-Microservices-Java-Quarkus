import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { flightApi, Flight, Airport } from '../api/endpoints';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Plane, ArrowRight, Search, MapPin, Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function FlightsListPage() {
  const { data: flights, isLoading } = useQuery<Flight[]>({ queryKey: ['flights'], queryFn: flightApi.getFlights });
  const { data: airports } = useQuery<Airport[]>({ queryKey: ['airports'], queryFn: flightApi.getAirports });
  const [search, setSearch] = useState('');

  const airportMap = useMemo(() => {
    const m: Record<number, Airport> = {};
    airports?.forEach(a => { m[a.id] = a; });
    return m;
  }, [airports]);

  const filtered = useMemo(() => {
    if (!flights) return [];
    if (!search.trim()) return flights;
    const q = search.toLowerCase();
    return flights.filter(f => {
      const dep = f.departureAirportId ? airportMap[f.departureAirportId] : null;
      const arr = f.arrivalAirportId ? airportMap[f.arrivalAirportId] : null;
      return (f.flightNumber?.toLowerCase().includes(q)) || (dep?.code?.toLowerCase().includes(q)) || (dep?.city?.toLowerCase().includes(q)) || (arr?.code?.toLowerCase().includes(q)) || (arr?.city?.toLowerCase().includes(q));
    });
  }, [flights, search, airportMap]);

  return (
    <div className="animate-fade-in">
      {/* Hero search */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-blue-700 text-white py-12 sm:py-16 px-4 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 sm:mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="w-8 h-8" />
            <h1 className="text-3xl sm:text-4xl font-bold">Tìm chuyến bay</h1>
          </div>
          <p className="text-blue-100 mb-8 text-lg">Khám phá hàng nghìn tuyến bay, so sánh giá và đặt vé dễ dàng</p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo mã chuyến bay, sân bay, thành phố..."
              className="w-full h-14 pl-12 pr-4 rounded-[var(--radius-lg)] text-[var(--color-text-main)] shadow-lg text-base"
            />
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex gap-6 mb-8 text-sm text-[var(--color-text-muted)]">
        <span className="font-medium">{flights?.length ?? 0} chuyến bay</span>
        <span>{filtered.length} kết quả</span>
      </div>

      {/* Flights grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Plane className="w-12 h-12 mx-auto text-[var(--color-text-muted)] opacity-30 mb-4" />
          <h3 className="text-lg font-semibold text-[var(--color-text-main)]">Không tìm thấy chuyến bay</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Thử từ khóa khác hoặc xóa bộ lọc</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(f => {
            const dep = f.departureAirportId ? airportMap[f.departureAirportId] : null;
            const arr = f.arrivalAirportId ? airportMap[f.arrivalAirportId] : null;
            return (
              <Link key={f.id} to={`/flights/${f.id}`} className="block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:shadow-[var(--shadow-md)] transition-all hover:border-[var(--color-primary)] group">
                <div className="flex flex-col sm:flex-row items-stretch">
                  {f.imageUrl && <img src={f.imageUrl} alt="" className="w-full sm:w-40 h-32 sm:h-auto object-cover rounded-t-[var(--radius-md)] sm:rounded-l-[var(--radius-md)] sm:rounded-tr-none" />}
                  <div className="flex-1 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Flight info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-[var(--color-primary)]">{f.flightNumber ?? 'N/A'}</span>
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
                    {/* Time */}
                    <div className="text-sm text-[var(--color-text-muted)]">
                      {f.departureTime && <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /><span>{new Date(f.departureTime).toLocaleString('vi-VN')}</span></div>}
                    </div>
                    {/* CTA */}
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

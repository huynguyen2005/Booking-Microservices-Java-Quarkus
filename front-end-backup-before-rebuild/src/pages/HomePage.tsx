import { Button } from '../components/ui/Button';
import { Search, MapPin, Calendar, Plane, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { flightApi, Flight, Airport } from '../api/endpoints';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useState, useMemo } from 'react';

export default function HomePage() {
  const { data: flights, isLoading: loadingFlights } = useQuery<Flight[]>({
    queryKey: ['flights'],
    queryFn: flightApi.getFlights,
  });

  const { data: airports } = useQuery<Airport[]>({
    queryKey: ['airports'],
    queryFn: flightApi.getAirports,
  });

  const [fromCode, setFromCode] = useState('');
  const [toCode, setToCode] = useState('');
  const [date, setDate] = useState('');

  const airportMap = useMemo(() => {
    const map: Record<number, Airport> = {};
    airports?.forEach(a => { map[a.id] = a; });
    return map;
  }, [airports]);

  const getAirportLabel = (id: number) => {
    const a = airportMap[id];
    return a ? `${a.city} (${a.code})` : `Airport #${id}`;
  };

  // Show latest 6 flights
  const featuredFlights = useMemo(() => {
    if (!flights) return [];
    let list = [...flights];
    if (fromCode) {
      const lower = fromCode.toLowerCase();
      list = list.filter(f => {
        const a = airportMap[f.departureAirportId];
        return a && (a.code.toLowerCase().includes(lower) || a.city.toLowerCase().includes(lower));
      });
    }
    if (toCode) {
      const lower = toCode.toLowerCase();
      list = list.filter(f => {
        const a = airportMap[f.arrivalAirportId];
        return a && (a.code.toLowerCase().includes(lower) || a.city.toLowerCase().includes(lower));
      });
    }
    if (date) {
      list = list.filter(f => f.departureTime.startsWith(date));
    }
    return list.slice(0, 6);
  }, [flights, fromCode, toCode, date, airportMap]);

  return (
    <div className="w-full flex flex-col gap-12 pb-16">
      {/* Hero Banner Area */}
      <section className="relative w-full h-[400px] md:h-[500px] mt-6 rounded-3xl overflow-hidden bg-slate-900 shadow-[var(--shadow-md)]">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop" 
          alt="SkyFlow Hero Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
            Chuyến bay hoàn hảo <br /> dành riêng cho bạn
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl font-medium drop-shadow">
            Khám phá thế giới cùng SkyFlow. Đặt vé dễ dàng, bay an toàn, trải nghiệm tuyệt vời.
          </p>
        </div>
      </section>

      {/* Flight Search Widget */}
      <section className="w-full px-4 md:px-8 -mt-24 relative z-10">
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-md)] p-6 md:p-8 max-w-5xl mx-auto border border-[var(--color-border)]">
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-main)]">Tìm kiếm chuyến bay</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--color-text-muted)]">Điểm khởi hành</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text-muted)]" />
                <input 
                  type="text" 
                  placeholder="Ví dụ: SGN" 
                  value={fromCode}
                  onChange={e => setFromCode(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-sm"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--color-text-muted)]">Điểm đến</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text-muted)]" />
                <input 
                  type="text" 
                  placeholder="Ví dụ: HAN" 
                  value={toCode}
                  onChange={e => setToCode(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--color-text-muted)]">Ngày đi</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text-muted)]" />
                <input 
                  type="date" 
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => { setFromCode(''); setToCode(''); setDate(''); }}
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              Xóa bộ lọc
            </button>
            <Link to="/flights">
              <Button size="lg" className="font-semibold gap-2">
                <Search className="w-4 h-4" />
                Xem tất cả chuyến bay
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Real flight cards */}
      <section className="px-4 md:px-8 max-w-5xl mx-auto w-full mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[var(--color-text-main)]">Chuyến bay nổi bật</h3>
          <Link to="/flights" className="text-sm text-[var(--color-primary)] font-medium hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {loadingFlights ? (
          <CardSkeleton count={3} />
        ) : featuredFlights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredFlights.map(flight => (
              <Link key={flight.id} to={`/flights/${flight.id}`} className="group">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden shadow-sm hover:shadow-[var(--shadow-md)] transition-all hover:-translate-y-1">
                  <div className="h-32 bg-[var(--color-surface-subtle)] overflow-hidden">
                    {flight.imageUrl ? (
                      <img src={flight.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={flight.flightNumber} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                        <Plane className="w-12 h-12 text-[var(--color-primary)] opacity-30" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-lg text-[var(--color-text-main)]">{getAirportLabel(flight.departureAirportId)}</h4>
                      <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                      <h4 className="font-bold text-lg text-[var(--color-text-main)]">{getAirportLabel(flight.arrivalAirportId)}</h4>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)] mb-3">
                      {flight.flightNumber} • {new Date(flight.departureTime).toLocaleDateString('vi-VN')}
                    </p>
                    <div className="flex justify-between items-center">
                      <StatusBadge status={flight.status} />
                      <Button size="sm" variant="outline">Xem chi tiết</Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <Plane className="w-12 h-12 mx-auto opacity-30 mb-4" />
            <p>Không tìm thấy chuyến bay phù hợp.</p>
          </div>
        )}
      </section>
    </div>
  );
}

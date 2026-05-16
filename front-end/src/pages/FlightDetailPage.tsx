import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { flightApi, Flight, Airport, Airplane, Seat } from '../api/endpoints';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/auth';
import { Plane, MapPin, Clock, ArrowRight, Loader2 } from 'lucide-react';

export default function FlightDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const flightId = Number(id);

  const { data: flight, isLoading } = useQuery<Flight | null>({ queryKey: ['flight', flightId], queryFn: () => flightApi.getFlightById(flightId), enabled: !!flightId });
  const { data: airports } = useQuery<Airport[]>({ queryKey: ['airports'], queryFn: flightApi.getAirports });
  const { data: airplanes } = useQuery<Airplane[]>({ queryKey: ['airplanes'], queryFn: flightApi.getAirplanes });
  const { data: seats } = useQuery<Seat[]>({ queryKey: ['seats', flightId], queryFn: () => flightApi.getSeats({ flightId }), enabled: !!flightId && !!user });

  const airportMap: Record<number, Airport> = {};
  airports?.forEach(a => { airportMap[a.id] = a; });
  const airplaneMap: Record<number, Airplane> = {};
  airplanes?.forEach(a => { airplaneMap[a.id] = a; });

  const depAirport = flight?.departureAirportId ? airportMap[flight.departureAirportId] : null;
  const arrAirport = flight?.arrivalAirportId ? airportMap[flight.arrivalAirportId] : null;
  const airplane = flight?.airplaneId ? airplaneMap[flight.airplaneId] : null;
  const isSeatUnavailable = (seat: Seat) => {
    const st = (seat.status ?? '').toUpperCase();
    return seat.booked || st === 'HELD' || st === 'BOOKED';
  };
  const availableSeats = seats?.filter(s => !isSeatUnavailable(s)) ?? [];

  const handleBook = () => {
    if (!user) { navigate('/login'); return; }
    navigate(`/bookings/new?flightId=${flightId}`);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>
  );

  if (!flight) return (
    <div className="text-center py-32">
      <h2 className="text-xl font-semibold text-[var(--color-text-main)]">Chuyến bay không tìm thấy</h2>
      <Link to="/flights" className="text-[var(--color-primary)] mt-4 inline-block">← Quay lại danh sách</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/flights" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-6 inline-block">← Quay lại danh sách chuyến bay</Link>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] overflow-hidden">
        {flight.imageUrl && <img src={flight.imageUrl} alt={`Ảnh chuyến bay ${flight.flightNumber ?? ''}`} className="w-full h-48 object-cover" />}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Plane className="w-6 h-6 text-[var(--color-primary)]" />
              <h1 className="text-2xl font-bold text-[var(--color-text-main)]">{flight.flightNumber ?? 'N/A'}</h1>
              <StatusBadge status={flight.status} />
            </div>
            <Button onClick={handleBook} size="lg" className="gap-2">
              Đặt vé ngay <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-8 items-start">
            <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Khởi hành</p>
              <p className="text-lg font-bold text-[var(--color-text-main)]">{depAirport?.code ?? '?'}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{depAirport?.name ?? ''}</p>
              {depAirport?.imageUrl && (
                <img
                  src={depAirport.imageUrl}
                  alt={`Ảnh sân bay ${depAirport.code ?? ''}`}
                  className="mt-2 w-[240px] h-[130px] object-cover rounded-md border border-[var(--color-border)]"
                />
              )}
              <div className="flex items-center gap-1 mt-2 justify-center sm:justify-start"><MapPin className="w-3 h-3" /><span className="text-xs text-[var(--color-text-muted)]">{depAirport?.city ?? ''}</span></div>
              {flight.departureTime && <div className="flex items-center gap-1 mt-1 justify-center sm:justify-start"><Clock className="w-3 h-3" /><span className="text-xs">{new Date(flight.departureTime).toLocaleString('vi-VN')}</span></div>}
            </div>
            <div className="flex items-center justify-center"><ArrowRight className="w-6 h-6 text-[var(--color-primary)]" /></div>
            <div className="text-center sm:text-right flex flex-col items-center sm:items-end">
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Đến</p>
              <p className="text-lg font-bold text-[var(--color-text-main)]">{arrAirport?.code ?? '?'}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{arrAirport?.name ?? ''}</p>
              {arrAirport?.imageUrl && (
                <img
                  src={arrAirport.imageUrl}
                  alt={`Ảnh sân bay ${arrAirport.code ?? ''}`}
                  className="mt-2 w-[240px] h-[130px] object-cover rounded-md border border-[var(--color-border)]"
                />
              )}
              <div className="flex items-center gap-1 mt-2 justify-center sm:justify-end"><MapPin className="w-3 h-3" /><span className="text-xs text-[var(--color-text-muted)]">{arrAirport?.city ?? ''}</span></div>
              {flight.arrivalTime && <div className="flex items-center gap-1 mt-1 justify-center sm:justify-end"><Clock className="w-3 h-3" /><span className="text-xs">{new Date(flight.arrivalTime).toLocaleString('vi-VN')}</span></div>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm border-t border-[var(--color-border)] pt-6">
            <div><span className="text-[var(--color-text-muted)]">Máy bay:</span> <span className="font-medium">{airplane ? `${airplane.code} — ${airplane.model}` : 'N/A'}</span></div>
            <div><span className="text-[var(--color-text-muted)]">Sức chứa máy bay:</span> <span className="font-medium">{airplane?.totalSeats ?? '—'}</span></div>
            <div><span className="text-[var(--color-text-muted)]">Ghế đã mở bán:</span> <span className="font-medium">{seats?.length ?? '—'}</span></div>
          </div>
        </div>
      </div>

      {user && seats && (
        <div className="mt-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-lg font-semibold mb-4">Ghế ngồi ({availableSeats.length} còn trống / {seats.length} tổng)</h2>
          <div className="flex flex-wrap gap-2">
            {seats.map(s => (
              <div key={s.id} className={`w-12 h-10 flex items-center justify-center text-xs font-mono rounded-md border transition-all ${isSeatUnavailable(s) ? 'bg-[var(--color-danger-soft)] text-[var(--color-danger)] border-[var(--color-danger)] opacity-50 cursor-not-allowed' : 'bg-[var(--color-success-soft)] text-[var(--color-success)] border-[var(--color-success)] hover:scale-105 cursor-pointer'}`}>
                {s.seatNumber ?? '?'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

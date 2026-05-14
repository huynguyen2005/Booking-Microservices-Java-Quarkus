import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { flightApi, Airport, Airplane } from '../api/endpoints';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { Plane, Clock, MapPin, Armchair } from 'lucide-react';

export default function FlightDetail() {
  const { id } = useParams();
  const flightId = Number(id);

  const { data: flight, isLoading } = useQuery({
    queryKey: ['flight', flightId],
    queryFn: () => flightApi.getFlightById(flightId),
    enabled: !!flightId
  });

  const { data: airports } = useQuery({
    queryKey: ['airports'],
    queryFn: flightApi.getAirports,
  });

  const { data: airplanes } = useQuery({
    queryKey: ['airplanes'],
    queryFn: flightApi.getAirplanes,
  });

  const { data: seats, isLoading: loadingSeats } = useQuery({
    queryKey: ['seats', flightId],
    queryFn: () => flightApi.getSeats(flightId),
    enabled: !!flightId
  });

  const getAirport = (airportId: number): Airport | undefined => airports?.find(a => a.id === airportId);
  const getAirplane = (airplaneId: number): Airplane | undefined => airplanes?.find(a => a.id === airplaneId);

  if (isLoading) return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <TableSkeleton rows={6} cols={3} />
    </div>
  );
  
  if (!flight) return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-center">
      <p className="text-lg text-[var(--color-text-muted)]">Chuyến bay không tồn tại.</p>
      <Link to="/flights"><Button variant="outline" className="mt-4">Quay lại danh sách</Button></Link>
    </div>
  );

  const depAirport = getAirport(flight.departureAirportId);
  const arrAirport = getAirport(flight.arrivalAirportId);
  const airplane = getAirplane(flight.airplaneId);

  const availableSeats = seats?.filter(s => !s.booked).length ?? 0;
  const totalSeats = seats?.length ?? 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-text-main)]">Chi tiết chuyến bay {flight.flightNumber}</h1>
      
      {/* Flight info card */}
      <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm mb-6">
        {/* Header with image */}
        {flight.imageUrl && (
          <div className="h-48 rounded-[var(--radius-md)] overflow-hidden mb-6">
            <img src={flight.imageUrl} alt={flight.flightNumber} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Route visualization */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-[var(--color-border)]">
          <div className="flex-1">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Khởi hành</p>
            <p className="text-2xl font-bold text-[var(--color-text-main)]">{depAirport?.code ?? `#${flight.departureAirportId}`}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{depAirport?.name ?? 'Đang tải...'}</p>
            <p className="text-sm font-semibold mt-2">{new Date(flight.departureTime).toLocaleString('vi-VN')}</p>
          </div>

          <div className="flex flex-col items-center px-6">
            <Plane className="w-5 h-5 text-[var(--color-primary)] rotate-90" />
            <div className="w-24 h-px bg-[var(--color-border)] my-2" />
            <p className="text-xs text-[var(--color-text-muted)]">Bay thẳng</p>
          </div>

          <div className="flex-1 text-right">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1 flex items-center justify-end gap-1"><MapPin className="w-3 h-3" /> Đến</p>
            <p className="text-2xl font-bold text-[var(--color-text-main)]">{arrAirport?.code ?? `#${flight.arrivalAirportId}`}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{arrAirport?.name ?? 'Đang tải...'}</p>
            <p className="text-sm font-semibold mt-2">{new Date(flight.arrivalTime).toLocaleString('vi-VN')}</p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Trạng thái</p>
            <StatusBadge status={flight.status} />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Máy bay</p>
            <p className="font-semibold text-sm">{airplane ? `${airplane.model} (${airplane.code})` : `ID: ${flight.airplaneId}`}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><Clock className="w-3 h-3" /> Thời gian bay</p>
            <p className="font-semibold text-sm">
              {(() => {
                const diff = new Date(flight.arrivalTime).getTime() - new Date(flight.departureTime).getTime();
                const h = Math.floor(diff / 3600000);
                const m = Math.round((diff % 3600000) / 60000);
                return `${h}h ${m}m`;
              })()}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><Armchair className="w-3 h-3" /> Ghế trống</p>
            <p className="font-semibold text-sm">{availableSeats} / {totalSeats}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Link to={`/flights/${flight.id}/booking`}>
            <Button size="lg" disabled={availableSeats === 0}>
              {availableSeats === 0 ? 'Hết chỗ' : 'Tiến hành đặt vé'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Seat availability */}
      <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-[var(--color-text-main)]">Sơ đồ ghế ngồi</h2>
        {loadingSeats ? (
          <TableSkeleton rows={3} cols={3} />
        ) : seats && seats.length > 0 ? (
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {seats.map(seat => (
              <div
                key={seat.id}
                className={`flex items-center justify-center h-10 rounded-[var(--radius-sm)] text-xs font-semibold border transition-colors ${
                  seat.booked
                    ? 'bg-[var(--color-danger-soft)] text-[var(--color-danger)] border-[var(--color-danger)] cursor-not-allowed opacity-60'
                    : 'bg-[var(--color-success-soft)] text-[var(--color-success)] border-[var(--color-success)] cursor-default'
                }`}
                title={seat.booked ? 'Đã đặt' : 'Còn trống'}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">Chưa có thông tin ghế cho chuyến bay này.</p>
        )}
        {seats && seats.length > 0 && (
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-[var(--color-success-soft)] border border-[var(--color-success)]" />
              Còn trống ({availableSeats})
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-[var(--color-danger-soft)] border border-[var(--color-danger)]" />
              Đã đặt ({totalSeats - availableSeats})
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

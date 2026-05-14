import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { passengerApi, flightApi, bookingApi, Flight, Passenger, Airport, Seat } from '../api/endpoints';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';
import { Loader2, Check, ChevronRight, Plane, Users, MapPin } from 'lucide-react';

const steps = ['Chọn hành khách', 'Chọn ghế', 'Xác nhận'];

export default function BookingNewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preFlightId = searchParams.get('flightId') ? Number(searchParams.get('flightId')) : null;

  const [step, setStep] = useState(0);
  const [selectedPassengerId, setSelectedPassengerId] = useState<number | null>(null);
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(preFlightId);
  const [seatNumber, setSeatNumber] = useState('');

  const { data: passengers } = useQuery<Passenger[]>({ queryKey: ['myPassengers'], queryFn: passengerApi.getMyPassengers });
  const { data: flights } = useQuery<Flight[]>({ queryKey: ['flights'], queryFn: flightApi.getFlights });
  const { data: airports } = useQuery<Airport[]>({ queryKey: ['airports'], queryFn: flightApi.getAirports });

  const airportMap = useMemo(() => {
    const m: Record<number, Airport> = {};
    airports?.forEach(a => { m[a.id] = a; });
    return m;
  }, [airports]);

  const selectedFlight = flights?.find(f => f.id === selectedFlightId);
  const selectedPassenger = passengers?.find(p => p.id === selectedPassengerId);


  const bookMut = useMutation({
    mutationFn: () => bookingApi.createBooking({ 
      passengerId: selectedPassengerId!, 
      flightId: selectedFlightId!, 
      seatNumber 
    }),
    onSuccess: () => { 
      toast.success('Đặt chỗ thành công!'); 
      navigate('/my-payments'); 
    },
    onError: (e: any) => {
      console.error('Booking Error:', e.response?.data);
      const msg = e.response?.data?.message || e.response?.data || 'Đặt chỗ thất bại';
      toast.error(msg);
    },
  });

  const { data: flightSeats, isLoading: loadingSeats } = useQuery<Seat[]>({
    queryKey: ['flightSeats', selectedFlightId],
    queryFn: () => flightApi.getSeats(selectedFlightId!),
    enabled: !!selectedFlightId && step === 1,
  });

  const canNext = () => {
    if (step === 0) return !!selectedPassengerId && !!selectedFlightId;
    if (step === 1) return !!seatNumber;
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Đặt vé</h1>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= step ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'}`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${i <= step ? 'text-[var(--color-text-main)] font-medium' : 'text-[var(--color-text-muted)]'}`}>{s}</span>
            {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />}
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 sm:p-8">
        {/* Step 0 — Select passenger + flight */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-3"><Users className="w-4 h-4" /> Chọn hành khách <span className="text-[var(--color-danger)]">*</span></label>
              {passengers && passengers.length > 0 ? (
                <div className="grid gap-2">
                  {passengers.map(p => (
                    <button key={p.id} onClick={() => setSelectedPassengerId(p.id)}
                      className={`w-full text-left px-4 py-3 rounded-[var(--radius-sm)] border transition-all ${selectedPassengerId === p.id ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'}`}>
                      <p className="font-medium">{p.fullName ?? 'Không tên'}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{p.email ?? ''} {p.passportNumber ? `• ${p.passportNumber}` : ''}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">Chưa có hành khách. <a href="/my-passengers" className="text-[var(--color-primary)]">Thêm hành khách →</a></p>
              )}
            </div>

            {!preFlightId && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3"><Plane className="w-4 h-4" /> Chọn chuyến bay <span className="text-[var(--color-danger)]">*</span></label>
                <select value={selectedFlightId ?? ''} onChange={e => setSelectedFlightId(Number(e.target.value))}>
                  <option value="">— Chọn —</option>
                  {flights?.map(f => {
                    const dep = f.departureAirportId ? airportMap[f.departureAirportId] : null;
                    const arr = f.arrivalAirportId ? airportMap[f.arrivalAirportId] : null;
                    return <option key={f.id} value={f.id}>{f.flightNumber} ({dep?.code ?? '?'} → {arr?.code ?? '?'})</option>;
                  })}
                </select>
              </div>
            )}

            {preFlightId && selectedFlight && (
              <div className="flex items-center gap-3 p-4 bg-[var(--color-primary-soft)] rounded-[var(--radius-sm)]">
                <Plane className="w-5 h-5 text-[var(--color-primary)]" />
                <div>
                  <p className="font-semibold">{selectedFlight.flightNumber}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {selectedFlight.departureAirportId ? airportMap[selectedFlight.departureAirportId]?.code : '?'} → {selectedFlight.arrivalAirportId ? airportMap[selectedFlight.arrivalAirportId]?.code : '?'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1 — Seat Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold mb-4">
              <MapPin className="w-4 h-4" /> Chọn chỗ ngồi <span className="text-[var(--color-danger)]">*</span>
            </label>
            
            {loadingSeats ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>
            ) : flightSeats && flightSeats.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {flightSeats.map(s => (
                  <button
                    key={s.id}
                    disabled={s.booked}
                    onClick={() => setSeatNumber(s.seatNumber ?? '')}
                    className={`
                      aspect-square rounded-md flex items-center justify-center text-xs font-bold transition-all
                      ${s.booked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 
                        seatNumber === s.seatNumber ? 'bg-[var(--color-primary)] text-white ring-2 ring-offset-2 ring-[var(--color-primary)]' : 
                        'bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-main)]'}
                    `}
                    title={s.booked ? 'Đã đặt' : `Ghế ${s.seatNumber}`}
                  >
                    {s.seatNumber}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-[var(--color-text-muted)]">Không tìm thấy sơ đồ ghế cho chuyến bay này.</p>
            )}

            <div className="flex items-center gap-4 mt-6 text-xs text-[var(--color-text-muted)]">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-white border border-[var(--color-border)]"></div> Trống</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[var(--color-primary)]"></div> Đang chọn</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-gray-200"></div> Đã đặt</div>
            </div>
          </div>
        )}

        {/* Step 2 — Confirm */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Xác nhận đặt chỗ</h3>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between p-3 bg-[var(--color-surface-subtle)] rounded-md"><span className="text-[var(--color-text-muted)]">Hành khách</span><span className="font-medium">{selectedPassenger?.fullName ?? '—'}</span></div>
              <div className="flex justify-between p-3 bg-[var(--color-surface-subtle)] rounded-md"><span className="text-[var(--color-text-muted)]">Chuyến bay</span><span className="font-medium">{selectedFlight?.flightNumber ?? '—'}</span></div>
              <div className="flex justify-between p-3 bg-[var(--color-surface-subtle)] rounded-md"><span className="text-[var(--color-text-muted)]">Ghế</span><span className="font-mono font-bold">{seatNumber}</span></div>
            </div>
          </div>
        )}

        {/* Nav */}
        <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
          <Button variant="ghost" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}>Quay lại</Button>
          {step < 2 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>Tiếp theo</Button>
          ) : (
            <Button onClick={() => bookMut.mutate()} disabled={bookMut.isPending} className="gap-2">
              {bookMut.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Xác nhận đặt vé
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

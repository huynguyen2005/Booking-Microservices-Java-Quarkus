import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { passengerApi, flightApi, bookingApi, Flight, Passenger, Airport, Seat } from '../api/endpoints';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';
import { Loader2, Check, ChevronRight, Plane, Users, MapPin } from 'lucide-react';

const steps = ['Chọn hành khách', 'Chọn ghế', 'Xác nhận'];

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return 'Chưa có';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('vi-VN');
};

const formatMoney = (amount: number | null | undefined, currency: string | null | undefined) => {
  const v = Number(amount ?? 0);
  const c = (currency ?? 'VND').toUpperCase();
  return `${v.toLocaleString('vi-VN')} ${c}`;
};

const flightStatusText = (status: string | null | undefined) => {
  const s = (status ?? '').toUpperCase();
  if (s === 'SCHEDULED') return 'Đang mở đặt chỗ';
  if (s === 'DELAYED') return 'Bị hoãn';
  if (s === 'CANCELLED') return 'Đã hủy';
  if (s === 'COMPLETED') return 'Đã hoàn tất';
  return s || 'Không xác định';
};

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
    airports?.forEach(a => {
      m[a.id] = a;
    });
    return m;
  }, [airports]);

  const selectedFlight = flights?.find(f => f.id === selectedFlightId);
  const selectedPassenger = passengers?.find(p => p.id === selectedPassengerId);

  const departureAirport = selectedFlight?.departureAirportId ? airportMap[selectedFlight.departureAirportId] : null;
  const arrivalAirport = selectedFlight?.arrivalAirportId ? airportMap[selectedFlight.arrivalAirportId] : null;

  const bookMut = useMutation({
    mutationFn: () =>
      bookingApi.createBooking({
        passengerId: selectedPassengerId!,
        flightId: selectedFlightId!,
        seatNumber,
      }),
    onSuccess: () => {
      toast.success('Đặt chỗ thành công');
      navigate('/my-payments');
    },
    onError: (e: any) => {
      const msg = e.response?.data?.message || e.response?.data || 'Đặt chỗ thất bại';
      toast.error(msg);
    },
  });

  const { data: flightSeats, isLoading: loadingSeats } = useQuery<Seat[]>({
    queryKey: ['flightSeats', selectedFlightId],
    queryFn: () => flightApi.getSeats({ flightId: selectedFlightId! }),
    enabled: !!selectedFlightId && step === 1,
  });

  const canBookSelectedFlight = selectedFlight ? ['SCHEDULED'].includes((selectedFlight.status ?? '').toUpperCase()) : true;

  const canNext = () => {
    if (step === 0) return !!selectedPassengerId && !!selectedFlightId && canBookSelectedFlight;
    if (step === 1) return !!seatNumber;
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Đặt vé</h1>

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
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-3"><Users className="w-4 h-4" /> Chọn hành khách <span className="text-[var(--color-danger)]">*</span></label>
              {passengers && passengers.length > 0 ? (
                <div className="grid gap-2">
                  {passengers.map(p => (
                    <button key={p.id} onClick={() => setSelectedPassengerId(p.id)} className={`w-full text-left px-4 py-3 rounded-[var(--radius-sm)] border transition-all ${selectedPassengerId === p.id ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'}`}>
                      <p className="font-medium">{p.fullName ?? 'Không tên'}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{p.email ?? ''} {p.passportNumber ? `- ${p.passportNumber}` : ''}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">Chưa có hành khách. <a href="/my-passengers" className="text-[var(--color-primary)]">Thêm hành khách</a></p>
              )}
            </div>

            {!preFlightId && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3"><Plane className="w-4 h-4" /> Chọn chuyến bay <span className="text-[var(--color-danger)]">*</span></label>
                <select value={selectedFlightId ?? ''} onChange={e => setSelectedFlightId(Number(e.target.value))}>
                  <option value="">- Chọn -</option>
                  {flights?.map(f => {
                    const dep = f.departureAirportId ? airportMap[f.departureAirportId] : null;
                    const arr = f.arrivalAirportId ? airportMap[f.arrivalAirportId] : null;
                    return <option key={f.id} value={f.id}>{f.flightNumber} ({dep?.code ?? '?'} {'->'} {arr?.code ?? '?'})</option>;
                  })}
                </select>
              </div>
            )}

            {selectedFlight && !canBookSelectedFlight && (
              <p className="text-sm p-3 rounded-md bg-[var(--color-warning-soft)] text-[var(--color-warning)]">
                Chuyến bay này không mở đặt chỗ. Chỉ được đặt khi trạng thái là SCHEDULED.
              </p>
            )}

            {preFlightId && selectedFlight && (
              <div className="flex items-center gap-3 p-4 bg-[var(--color-primary-soft)] rounded-[var(--radius-sm)]">
                <Plane className="w-5 h-5 text-[var(--color-primary)]" />
                <div>
                  <p className="font-semibold">{selectedFlight.flightNumber}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {selectedFlight.departureAirportId ? airportMap[selectedFlight.departureAirportId]?.code : '?'} {'->'} {selectedFlight.arrivalAirportId ? airportMap[selectedFlight.arrivalAirportId]?.code : '?'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

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
                  (() => {
                    const seatStatus = (s.status ?? '').toUpperCase();
                    const isUnavailable = s.booked || seatStatus === 'HELD' || seatStatus === 'BOOKED';
                    const unavailableLabel = seatStatus === 'HELD' ? 'Đang được giữ chỗ' : 'Đã đặt';
                    return (
                  <button
                    key={s.id}
                    disabled={isUnavailable}
                    onClick={() => setSeatNumber(s.seatNumber ?? '')}
                    className={`${isUnavailable ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : seatNumber === s.seatNumber ? 'bg-[var(--color-primary)] text-white ring-2 ring-offset-2 ring-[var(--color-primary)]' : 'bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-main)]'} aspect-square rounded-md flex items-center justify-center text-xs font-bold transition-all`}
                    title={isUnavailable ? unavailableLabel : `Ghế ${s.seatNumber}`}
                  >
                    {s.seatNumber}
                  </button>
                    );
                  })()
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-[var(--color-text-muted)]">Không tìm thấy sơ đồ ghế cho chuyến bay này.</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Xác nhận đặt chỗ</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Vui lòng kiểm tra lại thông tin trước khi xác nhận.</p>

            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[var(--color-surface-subtle)] rounded-md">
                <div><p className="text-[var(--color-text-muted)]">Hành khách</p><p className="font-medium">{selectedPassenger?.fullName ?? 'Chưa chọn'}</p></div>
                <div><p className="text-[var(--color-text-muted)]">ID hành khách</p><p className="font-medium">{selectedPassenger?.id ?? '-'}</p></div>
                <div><p className="text-[var(--color-text-muted)]">Email</p><p className="font-medium">{selectedPassenger?.email || 'Chưa cập nhật'}</p></div>
                <div><p className="text-[var(--color-text-muted)]">Số điện thoại</p><p className="font-medium">{selectedPassenger?.phone || 'Chưa cập nhật'}</p></div>
                <div><p className="text-[var(--color-text-muted)]">Số hộ chiếu</p><p className="font-medium">{selectedPassenger?.passportNumber || 'Chưa cập nhật'}</p></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[var(--color-surface-subtle)] rounded-md">
                <div><p className="text-[var(--color-text-muted)]">Mã chuyến bay</p><p className="font-medium">{selectedFlight?.flightNumber || `#${selectedFlight?.id ?? '-'}`}</p></div>
                <div><p className="text-[var(--color-text-muted)]">Trạng thái chuyến bay</p><p className="font-medium">{flightStatusText(selectedFlight?.status)}</p></div>
                <div><p className="text-[var(--color-text-muted)]">Sân bay đi</p><p className="font-medium">{departureAirport ? `${departureAirport.code} - ${departureAirport.name}` : 'Chưa có'}</p></div>
                <div><p className="text-[var(--color-text-muted)]">Sân bay đến</p><p className="font-medium">{arrivalAirport ? `${arrivalAirport.code} - ${arrivalAirport.name}` : 'Chưa có'}</p></div>
                <div><p className="text-[var(--color-text-muted)]">Giờ khởi hành</p><p className="font-medium">{formatDateTime(selectedFlight?.departureTime)}</p></div>
                <div><p className="text-[var(--color-text-muted)]">Giờ hạ cánh</p><p className="font-medium">{formatDateTime(selectedFlight?.arrivalTime)}</p></div>
                <div><p className="text-[var(--color-text-muted)]">Giá vé cơ bản</p><p className="font-medium">{formatMoney(selectedFlight?.basePrice, selectedFlight?.currency)}</p></div>
              </div>

              <div className="flex justify-between p-3 bg-[var(--color-primary-soft)] rounded-md">
                <span className="text-[var(--color-text-muted)]">Ghế đã chọn</span>
                <span className="font-mono font-bold text-[var(--color-text-main)]">{seatNumber || 'Chưa chọn'}</span>
              </div>

              <p className="text-xs text-[var(--color-text-muted)]">Sau khi xác nhận đặt chỗ, hệ thống sẽ chuyển bạn sang trang thanh toán.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
          <Button variant="ghost" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}>Quay lại</Button>
          {step < 2 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>Tiếp theo</Button>
          ) : (
            <Button onClick={() => bookMut.mutate()} disabled={bookMut.isPending || !canBookSelectedFlight} className="gap-2">
              {bookMut.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Xác nhận đặt vé
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

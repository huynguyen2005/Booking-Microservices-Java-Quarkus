import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { bookingApi, passengerApi, flightApi, Airport } from '../api/endpoints';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/auth';
import { toast } from '../components/ui/Toast';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { Plane, MapPin, Armchair, AlertCircle } from 'lucide-react';

export default function BookingProcessPage() {
  const { id } = useParams();
  const flightId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedPassengerId, setSelectedPassengerId] = useState<number | ''>('');
  const [seatNumber, setSeatNumber] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [seatAvailable, setSeatAvailable] = useState<boolean | null>(null);
  const [checkingSeat, setCheckingSeat] = useState(false);

  const { data: passengers, isLoading: loadingPass } = useQuery({ 
    queryKey: ['myPassengers'], 
    queryFn: passengerApi.getMyPassengers,
    enabled: !!user
  });

  const { data: flight, isLoading: loadingFlight } = useQuery({
    queryKey: ['flight', flightId],
    queryFn: () => flightApi.getFlightById(flightId),
    enabled: !!flightId
  });

  const { data: airports } = useQuery({
    queryKey: ['airports'],
    queryFn: flightApi.getAirports,
  });

  const { data: seats } = useQuery({
    queryKey: ['seats', flightId],
    queryFn: () => flightApi.getSeats(flightId),
    enabled: !!flightId
  });

  const airportMap = useMemo(() => {
    const map: Record<number, Airport> = {};
    airports?.forEach(a => { map[a.id] = a; });
    return map;
  }, [airports]);

  const getAirportLabel = (id: number) => {
    const a = airportMap[id];
    return a ? `${a.city} (${a.code})` : `Airport #${id}`;
  };

  const availableSeats = useMemo(() => seats?.filter(s => !s.booked) ?? [], [seats]);

  const handleCheckSeat = async () => {
    if (!seatNumber.trim()) {
      toast.error('Vui lòng nhập mã ghế.');
      return;
    }
    try {
      setCheckingSeat(true);
      const available = await flightApi.checkAvailability(flightId, seatNumber.toUpperCase());
      setSeatAvailable(available);
      if (available) {
        toast.success(`Ghế ${seatNumber.toUpperCase()} còn trống!`);
      } else {
        toast.error(`Ghế ${seatNumber.toUpperCase()} đã được đặt.`);
      }
    } catch (err: any) {
      toast.error('Không thể kiểm tra ghế. Vui lòng thử lại.');
      setSeatAvailable(null);
    } finally {
      setCheckingSeat(false);
    }
  };

  const createBooking = useMutation({
    mutationFn: () => bookingApi.createBooking({ passengerId: Number(selectedPassengerId), flightId, seatNumber: seatNumber.toUpperCase() }),
    onSuccess: () => {
      toast.success('Đặt chỗ thành công! Đang chuyển hướng đến thanh toán...');
      setShowConfirm(false);
      setTimeout(() => navigate('/my-payments'), 1000);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.response?.data || 'Lỗi khi đặt chỗ');
      setShowConfirm(false);
    }
  });

  if (!user) return <div className="p-8 text-center text-[var(--color-text-muted)]">Vui lòng đăng nhập để đặt vé.</div>;
  if (loadingFlight || loadingPass) return <div className="max-w-4xl mx-auto py-8 px-4"><TableSkeleton rows={5} cols={2} /></div>;
  if (!flight) return <div className="p-8 text-center text-[var(--color-danger)]">Không tìm thấy chuyến bay.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-main)]">Tạo Đặt Chỗ Mới</h2>
        
        {/* Flight info banner */}
        <div className="mb-6 p-5 bg-[var(--color-primary-soft)] border border-[var(--color-primary)] rounded-[var(--radius-md)]">
          <div className="flex items-center gap-3 mb-2">
            <Plane className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="font-bold text-lg text-[var(--color-text-main)]">{flight.flightNumber}</span>
            <StatusBadge status={flight.status} />
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{getAirportLabel(flight.departureAirportId)}</span>
            <span>→</span>
            <span>{getAirportLabel(flight.arrivalAirportId)}</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Khởi hành: {new Date(flight.departureTime).toLocaleString('vi-VN')}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            <Armchair className="w-3 h-3 inline mr-1" />
            {availableSeats.length} ghế trống
          </p>
        </div>

        <div className="space-y-6">
          {/* Passenger select */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--color-text-main)]">Chọn hành khách</label>
            {passengers && passengers.length > 0 ? (
              <select 
                className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                value={selectedPassengerId}
                onChange={(e) => setSelectedPassengerId(Number(e.target.value))}
              >
                <option value="">-- Chọn hành khách --</option>
                {passengers.map(p => (
                  <option key={p.id} value={p.id}>{p.fullName} ({p.passportNumber || 'Chưa có passport'})</option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-[var(--color-danger)] mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Bạn chưa có hành khách nào. Vui lòng thêm trong trang Hồ sơ.
              </div>
            )}
            <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/my-passengers')}>
              + Thêm hành khách mới
            </Button>
          </div>

          {/* Seat selection with availability check */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--color-text-main)]">Chọn ghế ngồi</label>
            
            {/* Quick select from available seats */}
            {availableSeats.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-[var(--color-text-muted)] mb-2">Chọn nhanh ghế trống:</p>
                <div className="flex flex-wrap gap-1.5">
                  {availableSeats.slice(0, 20).map(s => (
                    <button
                      key={s.id}
                      className={`px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] border transition-colors ${
                        seatNumber === s.seatNumber
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                          : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-main)]'
                      }`}
                      onClick={() => { setSeatNumber(s.seatNumber); setSeatAvailable(true); }}
                    >
                      {s.seatNumber}
                    </button>
                  ))}
                  {availableSeats.length > 20 && (
                    <span className="text-xs text-[var(--color-text-muted)] self-center">+{availableSeats.length - 20} ghế khác</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] uppercase"
                value={seatNumber}
                onChange={(e) => { setSeatNumber(e.target.value.toUpperCase()); setSeatAvailable(null); }}
                placeholder="A1"
              />
              <Button variant="outline" onClick={handleCheckSeat} disabled={checkingSeat || !seatNumber}>
                {checkingSeat ? 'Đang kiểm tra...' : 'Kiểm tra ghế'}
              </Button>
            </div>
            {seatAvailable === true && (
              <p className="text-sm text-[var(--color-success)] mt-2 flex items-center gap-1">✓ Ghế {seatNumber} còn trống</p>
            )}
            {seatAvailable === false && (
              <p className="text-sm text-[var(--color-danger)] mt-2 flex items-center gap-1">✗ Ghế {seatNumber} đã được đặt</p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-[var(--color-border)]">
            <Button 
              size="lg" 
              onClick={() => setShowConfirm(true)}
              disabled={createBooking.isPending || !selectedPassengerId || !seatNumber || seatAvailable === false}
            >
              {createBooking.isPending ? 'Đang xử lý...' : 'Xác nhận Đặt Chỗ'}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => createBooking.mutate()}
        title="Xác nhận đặt chỗ"
        message={`Đặt ghế ${seatNumber} trên chuyến bay ${flight.flightNumber} cho hành khách đã chọn?`}
        confirmText="Xác nhận"
        variant="primary"
        loading={createBooking.isPending}
      />
    </div>
  );
}

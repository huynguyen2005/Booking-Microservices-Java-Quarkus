import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkinApi, passengerApi, bookingApi, flightApi, Checkin, Passenger, Booking, Flight, Airport } from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Eye, Plane, User, Hash, FileText } from 'lucide-react';

export default function AdminCheckinsPage() {
  const { data: checkins, isLoading } = useQuery<Checkin[]>({ queryKey: ['adminCheckins'], queryFn: checkinApi.getAllCheckins });
  const { data: passengers } = useQuery<Passenger[]>({ queryKey: ['allPassengers'], queryFn: passengerApi.getAllPassengers });
  const { data: bookings } = useQuery<Booking[]>({ queryKey: ['allBookings'], queryFn: bookingApi.getAllBookings });
  const { data: flights } = useQuery<Flight[]>({ queryKey: ['allFlights'], queryFn: flightApi.getFlights });
  const { data: airports } = useQuery<Airport[]>({ queryKey: ['airports'], queryFn: flightApi.getAirports });

  const [selectedCheckin, setSelectedCheckin] = useState<Checkin | null>(null);

  const passengerMap = useMemo(() => {
    const m: Record<number, Passenger> = {};
    passengers?.forEach(p => { m[p.id] = p; });
    return m;
  }, [passengers]);

  const bookingMap = useMemo(() => {
    const m: Record<number, Booking> = {};
    bookings?.forEach(b => { m[b.id] = b; });
    return m;
  }, [bookings]);

  const flightMap = useMemo(() => {
    const m: Record<number, Flight> = {};
    flights?.forEach(f => { m[f.id] = f; });
    return m;
  }, [flights]);

  const airportMap = useMemo(() => {
    const m: Record<number, Airport> = {};
    airports?.forEach(a => { m[a.id] = a; });
    return m;
  }, [airports]);

  const columns: Column<Checkin>[] = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'User' },
    { key: 'ticketCode', header: 'Mã vé', render: c => <span className="font-mono font-bold text-[var(--color-primary)]">{c.ticketCode}</span> },
    { key: 'bookingId', header: 'Booking', render: c => bookingMap[c.bookingId]?.bookingCode ?? c.bookingId },
    { key: 'passengerId', header: 'Hành khách', render: c => passengerMap[c.passengerId]?.fullName ?? c.passengerId },
    { key: 'flightId', header: 'Chuyến bay', render: c => flightMap[c.flightId]?.flightNumber ?? c.flightId },
    { key: 'status', header: 'Trạng thái', render: c => <StatusBadge status={c.status} /> },
    { key: '_actions', header: '', sortable: false, render: c => (
        <div className="flex gap-1 justify-end">
          <Button size="sm" variant="ghost" onClick={() => setSelectedCheckin(c)}><Eye className="w-4 h-4 text-[var(--color-info)]" /></Button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Quản lý Check-ins</h1>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={7} /></div> : <DataTable columns={columns} data={checkins ?? []} pageSize={10} />}
      </div>

      {selectedCheckin && (
        <Modal open={!!selectedCheckin} onClose={() => setSelectedCheckin(null)} title="Chi tiết Check-in" maxWidth="max-w-md">
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-subtle)] rounded-lg">
              <FileText className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Mã vé / Thẻ lên máy bay</p>
                <p className="font-mono font-bold">{selectedCheckin.ticketCode}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-subtle)] rounded-lg">
              <Hash className="w-5 h-5 text-[var(--color-text-muted)]" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Mã Booking</p>
                <p className="font-medium">{bookingMap[selectedCheckin.bookingId]?.bookingCode ?? `#${selectedCheckin.bookingId}`}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-subtle)] rounded-lg">
              <User className="w-5 h-5 text-[var(--color-text-muted)]" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Hành khách</p>
                <p className="font-medium">{passengerMap[selectedCheckin.passengerId]?.fullName ?? `ID: ${selectedCheckin.passengerId}`}</p>
                {passengerMap[selectedCheckin.passengerId]?.email && (
                  <p className="text-xs text-[var(--color-text-muted)]">{passengerMap[selectedCheckin.passengerId].email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-subtle)] rounded-lg">
              <Plane className="w-5 h-5 text-[var(--color-text-muted)]" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Chuyến bay</p>
                <p className="font-bold text-[var(--color-primary)]">
                  {flightMap[selectedCheckin.flightId]?.flightNumber ?? `ID: ${selectedCheckin.flightId}`}
                </p>
                <p className="text-sm">
                  {flightMap[selectedCheckin.flightId] ? (
                    <>
                      {airportMap[flightMap[selectedCheckin.flightId].departureAirportId]?.code ?? '?'} → {airportMap[flightMap[selectedCheckin.flightId].arrivalAirportId]?.code ?? '?'}
                    </>
                  ) : ''}
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-[var(--color-border)]">
              <p className="text-sm mb-1 text-[var(--color-text-muted)]">Trạng thái:</p>
              <StatusBadge status={selectedCheckin.status} />
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setSelectedCheckin(null)}>Đóng</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

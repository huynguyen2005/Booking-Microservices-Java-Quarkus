import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkinApi, flightApi, Checkin, Flight } from '../../api/endpoints';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

export default function AdminCheckinsPage() {
  const { data: checkins, isLoading } = useQuery({ queryKey: ['adminCheckins'], queryFn: checkinApi.getAllCheckins });
  const { data: flights } = useQuery<Flight[]>({ queryKey: ['flightsList'], queryFn: flightApi.getFlights });

  const flightMap = useMemo(() => {
    const m: Record<number, Flight> = {};
    flights?.forEach(f => { m[f.id] = f; });
    return m;
  }, [flights]);

  const columns: Column<Checkin>[] = [
    { key: 'id', header: 'ID' },
    { key: 'ticketCode', header: 'Mã Vé', render: c => <span className="font-bold text-[var(--color-primary)] font-mono">{c.ticketCode}</span> },
    { key: 'passengerId', header: 'Hành khách', render: c => `PSG-${c.passengerId}` },
    { key: 'flightId', header: 'Chuyến bay', render: c => <span className="font-medium">{flightMap[c.flightId]?.flightNumber ?? `FL-${c.flightId}`}</span> },
    { key: 'status', header: 'Trạng thái', render: c => <StatusBadge status={c.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý Check-in</h1>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={5} /></div> : <DataTable columns={columns} data={checkins ?? []} pageSize={10} />}
      </div>
    </div>
  );
}

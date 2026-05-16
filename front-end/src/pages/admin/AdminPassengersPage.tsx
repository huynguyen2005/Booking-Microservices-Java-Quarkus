import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { passengerApi, Passenger } from '../../api/endpoints';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { toast } from '../../components/ui/Toast';
import { Search, Trash2 } from 'lucide-react';

function getErrorMessage(e: any): string {
  const data = e?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (typeof data?.message === 'string' && data.message.trim()) return data.message;
  if (typeof e?.message === 'string' && e.message.trim()) return e.message;
  return 'Lỗi';
}

export default function AdminPassengersPage() {
  const qc = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: passengers, isLoading } = useQuery<Passenger[]>({
    queryKey: ['adminPassengers', keyword],
    queryFn: () => keyword ? passengerApi.search(keyword) : passengerApi.getAllPassengers(),
  });

  const deleteMut = useMutation({
    mutationFn: passengerApi.deletePassenger,
    onSuccess: () => {
      toast.success('Đã xóa hành khách!');
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ['adminPassengers'] });
    },
    onError: (e: any) => {
      toast.error(getErrorMessage(e));
      setDeleteId(null);
    },
  });

  const columns: Column<Passenger>[] = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'User ID' },
    { key: 'fullName', header: 'Họ tên', render: p => <span className="font-medium">{p.fullName ?? '—'}</span> },
    { key: 'email', header: 'Email', render: p => p.email ?? '—' },
    { key: 'phone', header: 'SĐT', render: p => p.phone ?? '—' },
    { key: 'passportNumber', header: 'Hộ chiếu', render: p => p.passportNumber ? <span className="font-mono text-xs">{p.passportNumber}</span> : '—' },
    {
      key: '_actions',
      header: '',
      sortable: false,
      render: p => (
        <div className="flex gap-1 justify-end">
          <Button size="sm" variant="ghost" onClick={() => setDeleteId(p.id)} className="text-[var(--color-danger)]">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Quản lý hành khách</h1>
        <div className="flex items-center gap-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" /><input className="pl-9 w-64 text-sm" placeholder="Tìm tên/email/passport..." value={keyword} onChange={e => setKeyword(e.target.value)} /></div>
        </div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={5} cols={6} /></div> : <DataTable columns={columns} data={passengers ?? []} pageSize={10} />}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMut.mutate(deleteId)}
        title="Xóa hành khách"
        message="Bạn có chắc chắn muốn xóa hành khách này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
        loading={deleteMut.isPending}
      />
    </div>
  );
}

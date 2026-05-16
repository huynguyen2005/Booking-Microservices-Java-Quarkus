import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = 'Xác nhận', variant = 'danger', loading }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${variant === 'danger' ? 'bg-[var(--color-danger-soft)]' : variant === 'warning' ? 'bg-[var(--color-warning-soft)]' : 'bg-[var(--color-primary-soft)]'}`}>
          <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-[var(--color-danger)]' : variant === 'warning' ? 'text-[var(--color-warning)]' : 'text-[var(--color-primary)]'}`} />
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">{message}</p>
        <div className="flex gap-3 w-full pt-2">
          <Button variant="ghost" className="flex-1" onClick={onClose} disabled={loading}>Hủy</Button>
          <Button variant={variant === 'danger' ? 'destructive' : 'default'} className="flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? 'Đang xử lý...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

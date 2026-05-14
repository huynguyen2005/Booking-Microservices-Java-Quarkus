import { Toaster, toast as hotToast } from 'react-hot-toast';

export const toast = {
  success: (msg: string) => hotToast.success(msg, { duration: 3000 }),
  error: (msg: string) => hotToast.error(msg, { duration: 4000 }),
  info: (msg: string) => hotToast(msg, { icon: 'ℹ️', duration: 3000 }),
};

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--color-surface)',
          color: 'var(--color-text-main)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.875rem',
          boxShadow: 'var(--shadow-md)',
        },
      }}
    />
  );
}

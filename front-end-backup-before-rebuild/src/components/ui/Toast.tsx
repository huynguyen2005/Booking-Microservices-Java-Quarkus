import toast, { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--color-surface)',
          color: 'var(--color-text-main)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          fontSize: '14px',
          fontFamily: 'var(--font-sans)',
        },
        success: {
          iconTheme: { primary: 'var(--color-success)', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: 'var(--color-danger)', secondary: '#fff' },
        },
      }}
    />
  );
}

export { toast };

import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
let pushToast: ((msg: string, type: 'success' | 'error' | 'info') => void) | null = null;

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  pushToast?.(message, type);
}

const typeStyles: Record<string, React.CSSProperties> = {
  success: { background: '#8ac68a', color: '#fff' },
  error: { background: '#fc736d', color: '#fff' },
  info: { background: '#889df0', color: '#fff' },
};

const toastContainerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10000,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  pointerEvents: 'none',
};

const toastItemStyle: React.CSSProperties = {
  padding: '10px 24px',
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 600,
  fontFamily: 'var(--font-sans)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  animation: 'toast-in 250ms ease',
  pointerEvents: 'auto',
  whiteSpace: 'nowrap',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
  }, []);

  const add = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    const timer = setTimeout(() => remove(id), 2000);
    timersRef.current.set(id, timer);
  }, [remove]);

  useEffect(() => {
    pushToast = add;
    return () => { pushToast = null; };
  }, [add]);

  return createPortal(
    <div style={toastContainerStyle}>
      {toasts.map((t) => (
        <div key={t.id} style={{ ...toastItemStyle, ...typeStyles[t.type] }}>
          {t.message}
        </div>
      ))}
    </div>,
    document.body
  );
}

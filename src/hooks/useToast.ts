import { useState, useCallback, useEffect } from 'react';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

let globalShow: ((msg: string, type?: 'success' | 'error' | 'info') => void) | null = null;

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  globalShow?.(message, type);
}

export function useToast(autoHideMs = 2000) {
  const [state, setState] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'success',
  });

  const show = useCallback((msg: string, t: 'success' | 'error' | 'info' = 'success') => {
    setState({ visible: true, message: msg, type: t });
  }, []);

  const hide = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    globalShow = show;
    return () => { globalShow = null; };
  }, [show]);

  useEffect(() => {
    if (!state.visible) return;
    const timer = setTimeout(hide, autoHideMs);
    return () => clearTimeout(timer);
  }, [state.visible, hide, autoHideMs]);

  return { ...state, show, hide };
}

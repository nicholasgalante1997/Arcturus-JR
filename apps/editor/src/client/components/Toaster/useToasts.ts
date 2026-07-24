import { useCallback, useState } from 'react';

import type { Toast, ToastKind } from './types';

const TOAST_TTL_MS = 3200;

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, kind, message }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, TOAST_TTL_MS);
  }, []);

  return { toasts, push };
}

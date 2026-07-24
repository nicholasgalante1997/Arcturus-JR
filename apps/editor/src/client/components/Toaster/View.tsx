import { memo } from 'react';

import type { ToasterProps } from './types';

function ToasterView({ toasts }: ToasterProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="editor-toaster" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`editor-toast editor-toast--${toast.kind}`}>
          <span className="editor-toast__dot" />
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default memo(ToasterView);

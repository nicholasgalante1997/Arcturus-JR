import { memo } from 'react';

import type { BuildErrorPanelProps } from './types';

function BuildErrorPanelView({ output, onDismiss }: BuildErrorPanelProps) {
  return (
    <div className="editor-buildpanel" role="alert">
      <div className="editor-buildpanel__head">
        content-data build failed
        <button type="button" className="editor-buildpanel__close" onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      </div>
      <pre className="editor-buildpanel__output">{output}</pre>
    </div>
  );
}

export default memo(BuildErrorPanelView);

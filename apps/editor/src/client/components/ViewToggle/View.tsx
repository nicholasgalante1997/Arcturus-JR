import { memo } from 'react';

import type { ViewMode, ViewToggleProps } from './types';

const MODES: Array<{ mode: ViewMode; label: string }> = [
  { mode: 'editor', label: 'Editor' },
  { mode: 'split', label: 'Split' },
  { mode: 'preview', label: 'Preview' }
];

function ViewToggleView({ value, onChange }: ViewToggleProps) {
  return (
    <div className="editor-viewtoggle" role="tablist" aria-label="Editor view">
      {MODES.map(({ mode, label }) => (
        <button
          key={mode}
          type="button"
          role="tab"
          aria-selected={value === mode}
          className={`editor-viewtoggle__btn${value === mode ? ' editor-viewtoggle__btn--active' : ''}`}
          onClick={() => onChange(mode)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default memo(ViewToggleView);

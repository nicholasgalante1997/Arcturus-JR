import { memo } from 'react';

import type { ImagePickerProps } from './types';

function ImagePickerView({ options, value, onChange }: ImagePickerProps) {
  if (options.length === 0) return null;

  return (
    <div className="editor-image-picker__grid">
      {options.map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`editor-image-picker__thumb${value === src ? ' editor-image-picker__thumb--selected' : ''}`}
          onClick={() => onChange(src)}
        />
      ))}
    </div>
  );
}

export default memo(ImagePickerView);

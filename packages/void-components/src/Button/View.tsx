import { memo } from 'react';
import clsx from 'clsx';

import { pipeline } from '../utils/pipeline';
import type { ButtonProps } from './types';

function ButtonView({
  variant = 'primary',
  disabled = false,
  children,
  onClick,
  type = 'button',
  ariaLabel
}: ButtonProps) {
  return (
    <button
      className={clsx('void-button', `void-button--${variant}`, disabled && 'void-button--disabled')}
      disabled={disabled}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

export default pipeline(memo)(ButtonView);

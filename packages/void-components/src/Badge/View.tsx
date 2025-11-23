import { memo } from 'react';
import clsx from 'clsx';

import { pipeline } from '../utils/pipeline';
import type { BadgeProps } from './types';

function BadgeView({ children, variant = 'info' }: BadgeProps) {
  return (
    <span className={clsx('void-badge', `void-badge--${variant}`)}>
      {children}
    </span>
  );
}

export default pipeline(memo)(BadgeView);

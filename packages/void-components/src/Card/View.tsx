import { memo } from 'react';
import clsx from 'clsx';

import { pipeline } from '../utils/pipeline';
import type { CardProps } from './types';

function CardView({ children, header, footer, variant = 'default', padding = 'md' }: CardProps) {
  return (
    <div
      className={clsx(
        'void-card',
        `void-card--${variant}`,
        `void-card--padding-${padding}`
      )}
    >
      {header && <div className="void-card__header">{header}</div>}
      <div className="void-card__content">{children}</div>
      {footer && <div className="void-card__footer">{footer}</div>}
    </div>
  );
}

export default pipeline(memo)(CardView);

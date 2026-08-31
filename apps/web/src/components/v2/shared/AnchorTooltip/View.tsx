import clsx from 'clsx';
import { memo } from 'react';

import { AnchorTooltipProps } from './types';

function AnchorTooltipView({ className, children, anchor, id, visible }: AnchorTooltipProps) {
  const anchorName = anchor.startsWith('--') ? anchor : `--${anchor}`;

  return (
    <div
      style={{ positionAnchor: anchorName }}
      className={clsx('v2-anchor-tooltip', className, {
        'v2-anchor-tooltip--visible': visible
      })}
      id={id}
      role="tooltip"
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}

export default memo(AnchorTooltipView) as typeof AnchorTooltipView;

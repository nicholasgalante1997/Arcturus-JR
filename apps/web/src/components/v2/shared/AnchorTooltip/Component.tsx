import { memo } from 'react';

import { AnchorTooltipProps } from './types';
import AnchorTooltipView from './View';

function AnchorTooltip({ className, children, anchor, id, visible }: AnchorTooltipProps) {
  return (
    <AnchorTooltipView className={className} anchor={anchor} id={id} visible={visible}>
      {children}
    </AnchorTooltipView>
  );
}

export default memo(AnchorTooltip) as typeof AnchorTooltip;

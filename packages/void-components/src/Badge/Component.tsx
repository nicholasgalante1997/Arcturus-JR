import React from 'react';

import { pipeline } from '../utils/pipeline';
import BadgeView from './View';
import type { BadgeProps } from './types';

/**
 * Badge component for labels and status indicators
 *
 * @example
 * <Badge>New</Badge>
 *
 * @example
 * <Badge variant="success">Active</Badge>
 */
function Badge(props: BadgeProps) {
  return <BadgeView {...props} />;
}

export default pipeline(React.memo)(Badge);

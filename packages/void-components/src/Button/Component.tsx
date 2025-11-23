import React from 'react';

import { pipeline } from '../utils/pipeline';
import ButtonView from './View';
import type { ButtonProps } from './types';

/**
 * Button component for user interactions
 *
 * Supports primary and secondary variants with disabled states.
 * Use primary variant for main actions, secondary for less important actions.
 *
 * @example
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Save
 * </Button>
 *
 * @example
 * // Disabled state
 * <Button disabled>
 *   Cannot click
 * </Button>
 */
function Button(props: ButtonProps) {
  return <ButtonView {...props} />;
}

export default pipeline(React.memo)(Button);

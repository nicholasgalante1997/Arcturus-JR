import React from 'react';

import { pipeline } from '@/utils/pipeline';

import V2FooterView from './View';

import type { V2FooterProps } from './types';

/**
 * V2 Footer component with navigation and social links
 *
 * Features:
 * - Brand section with logo and tagline
 * - Social media links
 * - Navigation link sections
 * - Copyright and attribution
 * - Responsive grid layout
 *
 * @example
 * <V2Footer />
 */
function V2Footer(props: V2FooterProps) {
  return <V2FooterView {...props} />;
}

export default pipeline(React.memo)(V2Footer) as React.MemoExoticComponent<typeof V2Footer>;

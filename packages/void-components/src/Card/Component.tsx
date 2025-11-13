import React from 'react';

import { pipeline } from '../utils/pipeline';
import CardView from './View';
import type { CardProps } from './types';

/**
 * Card component for content containers
 *
 * Provides a flexible container with optional header and footer sections.
 * Use default variant for standard cards, elevated for emphasis.
 *
 * @example
 * // Basic card
 * <Card>
 *   <p>Card content</p>
 * </Card>
 *
 * @example
 * // Card with header and footer
 * <Card
 *   header={<h3>Title</h3>}
 *   footer={<Button>Action</Button>}
 * >
 *   <p>Card content</p>
 * </Card>
 *
 * @example
 * // Elevated card with custom padding
 * <Card variant="elevated" padding="lg">
 *   <p>Important content</p>
 * </Card>
 */
function Card(props: CardProps) {
  return <CardView {...props} />;
}

export default pipeline(React.memo)(Card) as React.MemoExoticComponent<typeof Card>;

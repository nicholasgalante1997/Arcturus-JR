import { memo } from 'react';

import { pipeline } from '@/utils/pipeline';

import { ErrorBoundaryViewProps } from './types';

function ErrorBoundaryView({ hasError, fallback, children }: ErrorBoundaryViewProps) {
  if (hasError) {
    return fallback;
  }
  return children;
}

export default pipeline(memo)(ErrorBoundaryView) as React.MemoExoticComponent<
  React.ComponentType<ErrorBoundaryViewProps>
>;

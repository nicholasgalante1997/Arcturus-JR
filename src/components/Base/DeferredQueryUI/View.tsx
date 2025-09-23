import React, { memo } from 'react';

import { ErrorBoundary } from '@/components/Base/ErrorBoundary';
import { pipeline } from '@/utils/pipeline';

import { DeferredQueryUIViewProps } from './types';

function DeferredQueryUIView({
  isInFlight,
  isError,
  hasData,
  placeholder,
  fallback,
  children
}: DeferredQueryUIViewProps) {
  return (
    <ErrorBoundary forceErrorState={isError} fallback={fallback}>
      {isInFlight && placeholder}
      {!isInFlight && hasData && children}
    </ErrorBoundary>
  );
}

export default pipeline(memo)(DeferredQueryUIView) as React.MemoExoticComponent<
  React.ComponentType<DeferredQueryUIViewProps>
>;

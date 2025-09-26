import { QueryErrorResetBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Loader } from '@/components/Base/Loader';
import { pipeline } from '@/utils/pipeline';

import DefaultErrorComponent from './components/DefaultErrorComponent';
import { type SEQProps } from './types';

function SuspenseEnabledQuery({
  fallback: Fallback = DefaultErrorComponent,
  placeholder = <Loader />,
  children
}: SEQProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <Fallback error={error} reset={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={placeholder}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export default pipeline(React.memo)(SuspenseEnabledQuery) as React.MemoExoticComponent<
  typeof SuspenseEnabledQuery
>;

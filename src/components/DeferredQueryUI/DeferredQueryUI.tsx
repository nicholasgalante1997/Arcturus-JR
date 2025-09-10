import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Loader } from '@/components/Loader';
import { DeferredQueryUIProps } from './types';

/**
 * A component that defers rendering a child component until the query
 * has either completed (with data or error) or has been cancelled.
 *
 * @param q The {@link UseQueryResult} that the component should wait for
 * @param children The component to render when the query has completed
 * @param fallback (optional) The component to render if the query errors
 * @param placeholder (optional) The component to render while the query is
 * in flight. If not provided, the query is not rendered until the query
 * has completed.
 */
function DeferredQueryUI({ q, children, fallback = null, placeholder = <Loader /> }: DeferredQueryUIProps) {
  const { data, error, isLoading, isPending, isError } = q;
  const isInFlight = isLoading || isPending;

  return (
    <ErrorBoundary fallback={fallback}>
      {isInFlight && placeholder}
      {!isInFlight && isError && fallback}
      {!isInFlight && !isError && Boolean(data) && children}
    </ErrorBoundary>
  );
}

export default React.memo(DeferredQueryUI);

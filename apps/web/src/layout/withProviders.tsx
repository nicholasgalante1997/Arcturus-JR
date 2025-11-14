/**
 * This QueryProvider / Provider component can only be leveraged Client Side
 * Consider an Isomorphic Provider if our needs change and we need providers
 * in a context or store pattern
 */
import {
  type DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import React from 'react';

import { getJavascriptEnvironment } from '@/utils/env';

function getDehydratedState(): DehydratedState | undefined {
  if (getJavascriptEnvironment() === 'browser') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any)?.__REACT_QUERY_STATE__;
  }
  return undefined;
}

/**
 * @deprecated
 */
function withProviders<Props extends React.PropsWithChildren<P>, P extends object>(
  Component: React.ComponentType<Props>
) {
  /**
   * This is _probably_ fine since this will never remount
   */
  return React.memo(function AppWithProviders(props: Props) {
    const [client] = React.useState(
      () =>
        new QueryClient({
          defaultOptions: {
            queries: {
              experimental_prefetchInRender: true,
              staleTime: 60 * 1000 // This data doesnt change consider a more aggressive stale time
            }
          }
        })
    );
    const [state] = React.useState(() => getDehydratedState());
    return (
      <QueryClientProvider client={client}>
        <HydrationBoundary state={state}>
          <Component {...props} />
        </HydrationBoundary>
      </QueryClientProvider>
    );
  });
}

export default withProviders;

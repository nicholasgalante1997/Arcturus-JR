import { type DehydratedState, QueryClient } from '@tanstack/react-query';

import { getJavascriptEnvironment } from '@/utils/env';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        experimental_prefetchInRender: true,
        staleTime: 10 * 60 * 1000 // This data doesnt change consider a more aggressive stale time
      }
    }
  });
}

export function getDehydratedState(): DehydratedState | undefined {
  if (getJavascriptEnvironment() === 'browser') {
    return (window as any)?.__REACT_QUERY_STATE__;
  }
  return undefined;
}

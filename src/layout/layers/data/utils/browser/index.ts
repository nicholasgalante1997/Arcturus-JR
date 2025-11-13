import { type DehydratedState, QueryClient } from '@tanstack/react-query';

import { getJavascriptEnvironment } from '@/utils/env';

interface CreateQueryClientOptions {
  env?: 'production' | 'development';
}

export function createQueryClient({ env }: CreateQueryClientOptions = { env: 'production' }) {
  const DEV_STALE_TIME = 0;
  const PROD_STALE_TIME = 7 * 60 * 60 * 1000;
  return new QueryClient({
    defaultOptions: {
      queries: {
        /**
         * We need this enabled for our experimental
         * .promise and use() suspense enabled querying to work
         */
        experimental_prefetchInRender: true,
        /**
         * We likely want a 0 second stale time in dev
         * In prod, this data doesnt change consider a more aggressive stale time
         */
        staleTime: env === 'production' ? PROD_STALE_TIME : DEV_STALE_TIME
      }
    }
  });
}

export function getDehydratedState(): DehydratedState | undefined {
  if (getJavascriptEnvironment() === 'browser') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any)?.__REACT_QUERY_STATE__;
  }
  return undefined;
}

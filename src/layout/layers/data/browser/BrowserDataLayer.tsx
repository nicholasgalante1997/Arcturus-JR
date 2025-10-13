/**
 * This QueryProvider / Provider component can only be leveraged Client Side
 * Consider an Isomorphic Provider if our needs change and we need providers
 * in a context or store pattern
 */
import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

import { pipeline } from '@/utils/pipeline';

import type { DataLayerProps } from '../types';

type Props = React.PropsWithChildren<Exclude<DataLayerProps['browser'], undefined>>;

function BrowserDataLayer({ children, client, state }: Props) {
  const [_client] = useState(client);
  const [_state] = useState(state);
  return (
    <QueryClientProvider client={_client}>
      <HydrationBoundary state={_state}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}

export default pipeline(React.memo)(BrowserDataLayer) as React.MemoExoticComponent<typeof BrowserDataLayer>;

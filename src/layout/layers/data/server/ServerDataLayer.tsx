/**
 * This code can be safely considered Isomorphic as it _should_ be executable
 * in _either_ a server or browser environment,
 * so we won't need to dynamically import it (I don't think)
 */
import { QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

import { pipeline } from '@/utils/pipeline';

import type { DataLayerProps } from '../types';

type Props = React.PropsWithChildren<Exclude<DataLayerProps['server'], undefined>>;

function BrowserDataLayer({ children, client }: Props) {
  const [_client] = useState(client);
  return <QueryClientProvider client={_client}>{children}</QueryClientProvider>;
}

export default pipeline(React.memo)(BrowserDataLayer) as React.MemoExoticComponent<typeof BrowserDataLayer>;

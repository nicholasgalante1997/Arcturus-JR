import React from 'react';

import { pipeline } from '@/utils/pipeline';

import BrowserDataLayer from './browser/BrowserDataLayer';
import MissingBrowserDataLayerPropsError from './errors/MissingBrowserDataLayerProps';
import MissingServerDataLayerPropsError from './errors/MissingServerDataLayerPropsError';
import ServerDataLayer from './server/ServerDataLayer';

import type { DataLayerProps } from './types';

function DataLayer({ children, javascriptRuntime, browser, server }: DataLayerProps) {
  if (javascriptRuntime === 'server') {
    if (!server) {
      throw new MissingServerDataLayerPropsError();
    }
    const { client } = server;
    return <ServerDataLayer client={client}>{children}</ServerDataLayer>;
  }

  if (!browser) {
    throw new MissingBrowserDataLayerPropsError();
  }

  const { client, state } = browser;

  return (
    <BrowserDataLayer client={client} state={state}>
      {children}
    </BrowserDataLayer>
  );
}

export default pipeline(React.memo)(DataLayer) as React.MemoExoticComponent<typeof DataLayer>;

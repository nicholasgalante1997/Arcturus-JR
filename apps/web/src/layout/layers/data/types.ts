import React from 'react';

import type { DehydratedState, QueryClient } from '@tanstack/react-query';

type BaseDataLayerProviderProps = {
  client: QueryClient;
};

type DataLayerServerProviderProps = BaseDataLayerProviderProps;
type DataLayerBrowserProviderProps = BaseDataLayerProviderProps & {
  state: DehydratedState;
};

type InternalDataLayerProps = {
  browser?: DataLayerBrowserProviderProps;
  server?: DataLayerServerProviderProps;
  javascriptRuntime: 'browser' | 'server';
};

export interface DataLayerProps extends React.PropsWithChildren<InternalDataLayerProps> {}

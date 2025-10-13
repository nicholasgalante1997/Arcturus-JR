import React from 'react';

import { IsomorphicDataLayer } from './layout/layers/data';
import { type DataLayerProps } from './layout/layers/data/types';
import { RouterLayer as IsomorphicRouterLayer } from './layout/layers/router';
import { type RouterLayerProps } from './layout/layers/router/types';
import { Document } from './layout/Layout';
import { pipeline } from './utils/pipeline';

interface AppProps {
  layers: {
    data: DataLayerProps;
    router: RouterLayerProps;
  };
}

function App({ layers }: AppProps) {
  return (
    <Document>
      <IsomorphicDataLayer {...layers.data}>
        <IsomorphicRouterLayer {...layers.router} />
      </IsomorphicDataLayer>
    </Document>
  );
}

export default pipeline(React.memo)(App) as React.MemoExoticComponent<typeof App>;

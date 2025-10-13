import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';

import { createQueryClient, getDehydratedState } from './layout/layers/data/utils/browser';
import { lazyRoutes } from './routes/routes';
import { getDefaultReactRouterStaticHydrationData } from './routes/utils/hydration';
import App from './App';
import { withRootProxy } from './react-mods';

const container = document.getElementById('root');

if (container) {
  const jsr = 'browser' as const;

  const qclient = createQueryClient();
  const dstate = getDehydratedState();

  const router = createBrowserRouter(lazyRoutes(), {
    hydrationData: window?.__staticRouterHydrationData || getDefaultReactRouterStaticHydrationData()
  });

  const root = withRootProxy(
    hydrateRoot(
      container,
      <App
        layers={{
          data: { javascriptRuntime: jsr, browser: { client: qclient, state: dstate! } },
          router: { javascriptRuntime: jsr, browser: { router } }
        }}
      />
    )
  );
  Object.defineProperty(window, '_ArcJrReactDOMRoot', {
    writable: false,
    value: root
  });
}

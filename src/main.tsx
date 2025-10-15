import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';

import { createQueryClient, getDehydratedState } from './layout/layers/data/utils/browser';
import { lazyRoutes } from './routes/routes';
import { getDefaultReactRouterStaticHydrationData } from './routes/utils/hydration';
import App from './App';

const ARC_ROOT = document.getElementById('arc_root');

if (ARC_ROOT) {
  console.log('Found div[id="arc_root"]; Attempting to hydrate root...');

  const jsr = 'browser' as const;

  const qclient = createQueryClient();
  const dstate = getDehydratedState();

  const router = createBrowserRouter(lazyRoutes(), {
    hydrationData: window?.__staticRouterHydrationData || getDefaultReactRouterStaticHydrationData()
  });

  const root = hydrateRoot(
    ARC_ROOT,
    <App
      layers={{
        data: { javascriptRuntime: jsr, browser: { client: qclient, state: dstate! } },
        router: { javascriptRuntime: jsr, browser: { router } }
      }}
    />
  );

  Object.defineProperty(window, '__ARC_JR_REACT_DOM_ROOT__', {
    value: root,
    writable: false,
    enumerable: true
  });

  console.log('React mounted!');
}

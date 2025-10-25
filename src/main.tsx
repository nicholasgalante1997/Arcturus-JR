import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';

import ArcSentry from './config/sentry/config';
import { createQueryClient, getDehydratedState } from './layout/layers/data/utils/browser';
import { lazyRoutes } from './routes/routes';
import { getDefaultReactRouterStaticHydrationData } from './routes/utils/hydration';
import { jlog } from './utils/log';
import App from './App';

const ARC_ROOT = document.getElementById('arc_root');

if (ARC_ROOT) {
  jlog('Found div[id="arc_root"]; Attempting to hydrate root...');

  const jsr = 'browser' as const;

  /**
   * Init Sentry
   */
  new ArcSentry().init();

  const qclient = createQueryClient();
  const dstate = getDehydratedState();

  const sentryIntegratedCreateBrowserRouter = ArcSentry.Sentry.wrapCreateBrowserRouterV7(createBrowserRouter);

  const router = sentryIntegratedCreateBrowserRouter(lazyRoutes(), {
    hydrationData: window?.__staticRouterHydrationData || getDefaultReactRouterStaticHydrationData()
  });

  const root = hydrateRoot(
    ARC_ROOT,
    <App
      layers={{
        data: { javascriptRuntime: jsr, browser: { client: qclient, state: dstate! } },
        router: { javascriptRuntime: jsr, browser: { router } }
      }}
    />,
    {
      /* Callback called when an error is thrown and not caught by an ErrorBoundary. */
      onUncaughtError: ArcSentry.Sentry.reactErrorHandler((error, errorInfo) => {
        jlog.label('react-uncaught-error', 'warn');
        jlog('Uncaught error', error, errorInfo.componentStack);
        jlog.unlabel();
      }),

      /* Callback called when React catches an error in an ErrorBoundary. */
      onCaughtError: ArcSentry.Sentry.reactErrorHandler(),

      /* Callback called when React automatically recovers from errors. */
      onRecoverableError: ArcSentry.Sentry.reactErrorHandler()
    }
  );

  Object.defineProperty(window, '__ARC_JR_REACT_DOM_ROOT__', {
    value: root,
    writable: false,
    enumerable: true
  });

  jlog('React mounted!');
}

import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';

import ArcSentry from './config/sentry/config';
import { createQueryClient, getDehydratedState } from './layout/layers/data/utils/browser';
import { lazyRoutes } from './routes/routes';
import { getDefaultReactRouterStaticHydrationData } from './routes/utils/hydration';
import { jlog } from './utils/log';
import App from './App';

export interface BootstrapOptions {
  env?: 'production' | 'development';
}

export function bootstrap({ env }: BootstrapOptions = { env: 'production' }) {
  jlog('Starting ARC-JR bootstrapping process...');
  const ARC_ROOT = document.getElementById('arc_root');

  if (ARC_ROOT) {
    const jsr = 'browser' as const;

    /**
     * We want a different side-effect for our production App mounting
     * where we launch Sentry for exception monitoring
     * and hydrate a dehydrated stateful markup
     * that we prerender/prebuild at compile time,
     *
     * when we're in development mode, we really only need an HMR dev-server,
     * we don't want Sentry monitoring in-development code,
     * and we don't need to prerender/prefetch our queries ahead of time
     */
    if (env === 'production') {
      jlog('NODE_ENV = production');
      jlog('Found div[id="arc_root"]; Attempting to hydrate root...');

      new ArcSentry().init();

      const qclient = createQueryClient();
      const dstate = getDehydratedState();

      const sentryIntegratedCreateBrowserRouter =
        ArcSentry.Sentry.wrapCreateBrowserRouterV7(createBrowserRouter);

      const router = sentryIntegratedCreateBrowserRouter(lazyRoutes(), {
        hydrationData: window?.__staticRouterHydrationData || getDefaultReactRouterStaticHydrationData()
      });

      const root = hydrateRoot(
        ARC_ROOT,
        /**
         * So, React
         * In the 19th version of its Lord,
         * Has this (once, but no longer) anamalous bug
         * where because the TOP layer of our React app is not Markup (A Markup Wrapper, An HTML Element)
         * It can't seem to find it in hydration when it comes time to hydrate
         * And we end up with TWO COUNT EM TWO whole fucking apps being mounted to the DOM
         * Which we ultimately don't want in any case,
         * 
         * So this has been the most reliable way to avoid it,
         * making the top level of the app an HTML element,
         * instead of Providers
         * 
         * React will tell you to use hydrateRoot(document)
         * But they dont know wtf they're talking about
         * Bc that also still amounts to two Apps rendering/hydrating
         * So clearly they have not worked out all the kinks around prerendering on the edge
         * 
         * Wild stuff - Johnny Carson
         */
        <div id="arc_root">
          <App
            layers={{
              data: { javascriptRuntime: jsr, browser: { client: qclient, state: dstate! } },
              router: { javascriptRuntime: jsr, browser: { router } }
            }}
          />
        </div>,
        {
          onUncaughtError: ArcSentry.Sentry.reactErrorHandler((error, errorInfo) => {
            jlog.label('react-uncaught-error', 'warn');
            jlog('Uncaught error', error, errorInfo.componentStack);
            jlog.unlabel();
          }),
          onCaughtError: ArcSentry.Sentry.reactErrorHandler(),
          onRecoverableError: ArcSentry.Sentry.reactErrorHandler()
        }
      );

      Object.defineProperty(window, '__ARC_JR_REACT_DOM_ROOT__', {
        value: root,
        writable: false,
        enumerable: true
      });
    } else if (env === 'development') {
      jlog('NODE_ENV = development');
      jlog('Found div[id="arc_root"]; Attempting to create root...');
      const router = createBrowserRouter(lazyRoutes());
      const root = createRoot(ARC_ROOT);
      root.render(
        <App
          layers={{
            data: {
              javascriptRuntime: jsr,
              browser: { client: createQueryClient({ env }), state: { mutations: [], queries: [] } }
            },
            router: { javascriptRuntime: jsr, browser: { router } }
          }}
        />
      );
    }

    jlog('React mounted!');
  } else {
    jlog.label("error");
    jlog('Unable to find [ARC_ROOT] (#arc_root), regressing to static site behavior...');
    jlog.unlabel();
  }
}

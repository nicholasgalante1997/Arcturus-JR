import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';

import App from './App';
import { withRootProxy } from './react-mods';
import { getLazyLoadedRoutes } from './routes/routes';

const container = document.getElementById('root');

if (container) {
  /** Create a modified React Root */
  const root = withRootProxy(createRoot(container));

  /** Attach it to the window object */
  Object.defineProperty(window, '_ArcJrReactDOMRoot', {
    writable: false,
    value: root
  });

  const router = createBrowserRouter(getLazyLoadedRoutes());

  /** Mount the Application to the DOM with ReactDOM's `createRoot` */
  root.render(
    <React.StrictMode>
      <App router={router} />
    </React.StrictMode>
  );
}

import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { withRootProxy } from './react-mods';

const container = document.getElementById('root');

if (container) {
  /** Create a modified React Root */
  const root = withRootProxy(createRoot(container));

  /** Attach it to the window object */
  Object.defineProperty(window, '_ArcJrReactDOMRoot', {
    writable: false,
    value: root
  });

  /** Mount the Application to the DOM with ReactDOM's `createRoot` */
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

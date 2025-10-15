import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { lazyRoutes } from '@/routes/routes';

const router = createBrowserRouter(lazyRoutes());

function App() {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            experimental_prefetchInRender: true
          }
        }
      })
  );

  return (
   <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('arc_root');

  if (container) {
    const root = createRoot(container);
    root.render(<App />);
    console.log('React mounted!');
  }
});

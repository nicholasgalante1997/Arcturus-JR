import { createBrowserRouter } from 'react-router';

import { createLazyRouteConfiguration } from './utils/lazy';

let routes: ReturnType<typeof createBrowserRouter> | null = null;

function getLazyLoadedRoutes() {
  if (!routes) {
    routes = createBrowserRouter([
      {
        path: '/',
        lazy: createLazyRouteConfiguration('Home')
      },
      {
        path: '/about',
        lazy: createLazyRouteConfiguration('About')
      },
      {
        path: '/contact',
        lazy: createLazyRouteConfiguration('Contact')
      },
      {
        path: '/posts',
        lazy: createLazyRouteConfiguration('Posts')
      },
      {
        path: '/post/:id',
        lazy: createLazyRouteConfiguration('Post')
      }
    ]);
  }

  return routes;
}

export { getLazyLoadedRoutes };

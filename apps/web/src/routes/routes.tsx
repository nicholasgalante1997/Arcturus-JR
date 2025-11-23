import { type RouteObject } from 'react-router';

import { createLazyRouteConfiguration } from './utils/lazy';

let routes: RouteObject[] | null = null;

function lazyRoutes() {
  if (!routes) {
    routes = [
      {
        path: '/',
        lazy: createLazyRouteConfiguration('Home'),
        index: true
      },
      {
        path: '/about',
        lazy: createLazyRouteConfiguration('About')
      },
      {
        path: '/ee/ciphers',
        lazy: createLazyRouteConfiguration('Ciphers')
      },
      {
        path: '/ee/cipher/:id',
        lazy: createLazyRouteConfiguration('Cipher')
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
    ];
  }

  return routes;
}

export { lazyRoutes };

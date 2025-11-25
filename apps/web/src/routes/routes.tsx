import { RoutesConfig } from '@arcjr/config';
import { RouteConfigurationPathKeysEnum } from '@arcjr/types';
import { type RouteObject } from 'react-router';

import { createLazyRouteConfiguration } from './utils/lazy';

let routes: RouteObject[] | null = null;
const pathKey = RouteConfigurationPathKeysEnum.Browser;

function lazyRoutes() {
  if (!routes) {
    routes = RoutesConfig.V1_AllRouteConfigurations.map((rc) => ({
      path: rc.path[pathKey],
      lazy: createLazyRouteConfiguration(rc.page),
      index: Boolean(rc.index)
    }));
  }

  return routes;
}

/**
 * @deprecated
 */
const DO_NOT_USE___routes: RouteObject[] = [
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

export { lazyRoutes };

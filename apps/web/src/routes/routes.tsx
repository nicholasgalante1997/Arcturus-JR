import { RoutesConfig } from '@arcjr/config';
import { QueryFnName, RouteConfiguration, RouteConfigurationPathKeysEnum } from '@arcjr/types';
import { type RouteObject } from 'react-router';

import { createLazyRouteConfiguration } from './utils/lazy';

let routes: RouteObject[] | null = null;
const pathKey = RouteConfigurationPathKeysEnum.Browser;

const mapRouteConfigToReactRouterRouteObject = <
  PrefetchQueryFnName extends QueryFnName,
  PrefetchQueryFnParams,
  RC extends RouteConfiguration<PrefetchQueryFnName, PrefetchQueryFnParams>
>(
  rc: RC
): RouteObject => ({
  path: rc.path[pathKey],
  lazy: createLazyRouteConfiguration(rc.page),
  index: Boolean(rc.index)
});

function lazyRoutes() {
  if (!routes) {
    routes = [
      ...RoutesConfig.V1_AllRouteConfigurations.map(mapRouteConfigToReactRouterRouteObject),
      mapRouteConfigToReactRouterRouteObject(RoutesConfig.V2_HomePageRouteConfiguration)
    ];
  }

  return routes;
}

export { lazyRoutes };

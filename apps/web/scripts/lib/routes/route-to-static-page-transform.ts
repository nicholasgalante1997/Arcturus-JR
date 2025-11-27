import {
  type QueryFnName,
  type RouteConfiguration,
  RouteConfigurationPathKeysEnum,
  type StaticPageObject
} from '@arcjr/types';

import { mapSerializablePrefetchQueryOptionsToStaticPagePrefetchQueryOptions } from '../prefetch/prefetch-query-options-transform';

function transformStaticRoutePath(routePath: string, routePathParam: string = ''): string {
  const path = routePath.replace(':id', encodeURIComponent(routePathParam));
  return path;
}

/**
 * Can convert a serializable RouteConfig into a StaticPageObject which our render process expects
 */
export function mapRouteConfigurationToStaticPageObject<
  PrefetchQueryOptionsFnName extends QueryFnName,
  PrefetchQueryOptionsFnParams
>(
  {
    path: routeConfigPath,
    queries,
    styles = [],
    type
  }: RouteConfiguration<PrefetchQueryOptionsFnName, PrefetchQueryOptionsFnParams>,
  dynamicRoutePath: string | null = null,
  dynamicRouteParams: PrefetchQueryOptionsFnParams | null = null
): StaticPageObject {
  const staticRoutePath = routeConfigPath[RouteConfigurationPathKeysEnum.Static];
  return {
    path:
      type === 'dynamic' && dynamicRoutePath
        ? transformStaticRoutePath(staticRoutePath, dynamicRoutePath)
        : staticRoutePath,
    queries: queries.map((query) =>
      mapSerializablePrefetchQueryOptionsToStaticPagePrefetchQueryOptions(
        query,
        type,
        type === 'dynamic' ? dynamicRouteParams! : undefined
      )
    ),
    styles
  };
}

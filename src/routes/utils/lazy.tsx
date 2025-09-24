import type { RouteObject } from 'react-router';

type LazyRouteObject = Exclude<RouteObject['lazy'], undefined>;

export function createLazyRouteConfiguration(page: string): LazyRouteObject {
  return {
    Component: async () =>
      (
        await import(
          /* webpackChunkName: "[request]~chunk" */
          /* webpackInclude: /\.(js|jsx|ts|tsx)$/ */
          /* webpackMode: "lazy" */
          /* webpackExports: ["default"] */
          /* webpackFetchPriority: "high" */
          /* webpackPrefetch: true */
          /* webpackPreload: true */
          '@/pages/' + page
        )
      ).default
  };
}

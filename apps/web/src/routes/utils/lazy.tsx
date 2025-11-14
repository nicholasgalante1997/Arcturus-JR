import type { RouteObject } from 'react-router';

type LazyRouteObject = Exclude<RouteObject['lazy'], undefined>;

/**
 * createLazyRouteConfiguration
 *
 * @see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
 * @see https://reactrouter.com/start/data/custom#3-lazy-loading
 *
 * Similar to how we can lazy load a Component using React.lazy,
 * we can also lazy load a route using the lazy property on a RouteObject.
 * It accepts a subset of the fields that the base RouteObject accepts,
 * but for our purposes, we'll primarily be concerned with
 * - Component
 * - loader
 *
 * So that we can lazy load a React Page for a given route,
 * and so that we can lazy load/provision any data loaders that route depends on.
 *
 * Since we're using Webpack as our bundler,
 * we can use Magic Comments to control how Webpack handles these dynamic imports,
 * and chunk each bundle separately, and still instruct our final markup
 * to preload/prefetch these resources as necessary.
 */

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

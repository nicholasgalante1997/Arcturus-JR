import { RoutesConfig } from '@arcjr/config';

import { mapRouteConfigurationToStaticPageObject } from './routes/route-to-static-page-transform';
import { StaticPageObject } from './types/static-page';
import { cipher_slugs } from './ciphers';
import { slugs } from './posts';

export function createStaticPageObjects(): StaticPageObject[] {
  return [
    ...RoutesConfig.V1_StaticRouteConfigurations.map((rc) =>
      mapRouteConfigurationToStaticPageObject(rc, null)
    ),
    ...slugs.map((slug) =>
      mapRouteConfigurationToStaticPageObject(RoutesConfig.V1_PostPageRouteConfiguration, slug, slug)
    ),
    ...cipher_slugs.map((cipher_name) =>
      mapRouteConfigurationToStaticPageObject(
        RoutesConfig.V1_CipherPageRouteConfiguration,
        cipher_name,
        cipher_name
      )
    ),
    mapRouteConfigurationToStaticPageObject(RoutesConfig.V2_HomePageRouteConfiguration, null),
    mapRouteConfigurationToStaticPageObject(RoutesConfig.V2_PostsPageRouteConfiguration, null),
    // V2 Post Detail dynamic routes
    ...slugs.map((slug) =>
      mapRouteConfigurationToStaticPageObject(
        RoutesConfig.V2_PostDetailPageRouteConfiguration,
        slug,
        slug
      )
    )
  ];
}

/**
 * SECTION
 *
 * How the old way worked:
 * - We had an array of pseudo-static page configurations with keys for:
 *  - queries: { queryKey, queryFn }[]
 *  - path (Routing)
 *  - styles (CSS)
 * - And we used these to fulfill things we needed for the prerender process
 *   namely, prefetching data at compile time, and knowing what route we wanted to render,
 *   and selectively embedding styles
 * - One of the big cons of this setup, is that we had to manually keep this prerender setup
 *   in sync with the client side React Router setup that we had in src/routes.
 *   And what src/routes cared about was different than what prerender cared about
 *   It only cared about config specific to React Router
 *   - Whether the route was index
 *   - What the pathname was
 *   - What page to lazy load
 *
 * How the new way works:
 * - We have a shared RoutesConfig from `@arcjr/config`
 *   we convert serializable config values into
 *    - Data Prerender needs
 *        - path
 *        - queries
 *        - styles
 *        - dynamic page or static page
 *
 *    - Data React Router needs on the client
 *      - path
 *      - Page
 *      - index?:bool
 *
 * !SECTION
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { RoutesConfig } from '@arcjr/config';

import { getCipher } from '@/hooks/useCipher';
import { getCiphers } from '@/hooks/useCiphers';
import { getMarkdown } from '@/hooks/useMarkdown';
import { getPost } from '@/hooks/usePost';
import { getPosts } from '@/hooks/usePosts';

import { mapRouteConfigurationToStaticPageObject } from './routes/route-to-static-page-transform';
import { DYNAMIC_ROUTES, NON_DYNAMIC_ROUTES } from './routes/routes';
import { StaticPageObject } from './types/static-page';
import { cipher_slugs } from './ciphers';
import { slugs } from './posts';

const BASE_CSS_STYLES = ['/css/styles.min.css', '/css/themes/sb.min.css'];
const VOID_CSS_STYLES = ['/css/themes/void/void.css'];

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
    )
  ];
}

/** @deprecated */
const StaticPageObjects: StaticPageObject[] = [
  {
    path: NON_DYNAMIC_ROUTES.HOME,
    queries: [
      {
        queryKey: ['markdown', '/content/home.md'],
        queryFn: () => getMarkdown('/content/home.md')
      },
      {
        queryKey: ['posts'],
        queryFn: () => getPosts()
      }
    ],
    styles: [...BASE_CSS_STYLES]
  },
  {
    path: NON_DYNAMIC_ROUTES.ABOUT,
    queries: [
      {
        queryKey: ['markdown', '/content/about.md'],
        queryFn: () => getMarkdown('/content/about.md')
      }
    ],
    styles: [...BASE_CSS_STYLES]
  },
  {
    path: NON_DYNAMIC_ROUTES.CONTACT,
    queries: [],
    styles: [...BASE_CSS_STYLES, '/css/contact.min.css']
  },
  {
    path: NON_DYNAMIC_ROUTES.POSTS,
    queries: [
      {
        queryKey: ['posts'],
        queryFn: () => getPosts()
      }
    ],
    styles: [...BASE_CSS_STYLES, '/css/post.min.css']
  },
  ...createStaticPostPageObjects(),
  {
    path: NON_DYNAMIC_ROUTES.CIPHERS,
    queries: [
      {
        queryKey: ['ciphers'],
        queryFn: () => getCiphers()
      }
    ],
    styles: [...VOID_CSS_STYLES]
  },
  ...createStaticCipherPageObjects()
];

/**
 * @deprecated
 */
function createStaticPostPageObjects(): StaticPageObject[] {
  return slugs.map((postId) => ({
    path: DYNAMIC_ROUTES.POST.replace(':id', encodeURIComponent(postId)),
    queries: [
      {
        queryKey: ['post', postId],
        queryFn: () => getPost(postId)
      }
    ],
    styles: [...BASE_CSS_STYLES, '/css/post.min.css']
  }));
}

/**
 * @deprecated
 */
function createStaticCipherPageObjects(): StaticPageObject[] {
  return cipher_slugs.map((cipher_name) => ({
    path: DYNAMIC_ROUTES.CIPHER.replace(':id', encodeURIComponent(cipher_name)),
    queries: [
      {
        queryKey: ['cipher', cipher_name],
        queryFn: () => getCipher(cipher_name)
      }
    ],
    styles: [...VOID_CSS_STYLES]
  }));
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

/* eslint-disable @typescript-eslint/no-unused-vars */
import { RoutesConfig } from '@arcjr/config';
import {
  type PrefetchQueryOptions,
  type QueryFnName,
  type RouteConfiguration,
  RouteConfigurationPathKeysEnum,
  type SerializablePrefetchQueryOptions
} from '@arcjr/types';

import { getCipher } from '@/hooks/useCipher';
import { getCiphers } from '@/hooks/useCiphers';
import { getMarkdown } from '@/hooks/useMarkdown';
import { getPost } from '@/hooks/usePost';
import { getPosts } from '@/hooks/usePosts';

import { StaticPageObject } from './types/static-page';
import { cipher_slugs } from './ciphers';
import { slugs } from './posts';
import QueryFnRegistry from './query-registry';
import { DYNAMIC_ROUTES, NON_DYNAMIC_ROUTES } from './routes';

const BASE_CSS_STYLES = ['/css/styles.min.css', '/css/themes/sb.min.css'];
const VOID_CSS_STYLES = ['/css/themes/void/void.css'];

const queryFnRegistry = new QueryFnRegistry();

function transformStaticRoutePath(routePath: string, routePathParam: string = ''): string {
  const path = routePath.replace(':id', encodeURIComponent(routePathParam));
  return path;
}

function mapSerializablePrefetchQueryOptionsToStaticPagePrefetchQueryOptions<
  _QueryFnName extends QueryFnName,
  QueryFnParams
>(
  { queryFnName, queryFnParams, queryKey }: SerializablePrefetchQueryOptions<_QueryFnName, QueryFnParams>,
  type: 'dynamic' | 'static',
  dynamicParams?: QueryFnParams
): PrefetchQueryOptions {
  const qkeys = [...queryKey];
  if (type === 'dynamic' && dynamicParams) {
    qkeys.push(typeof dynamicParams === 'string' ? dynamicParams : JSON.stringify(dynamicParams));
  }

  const qfn = queryFnRegistry.request(queryFnName);

  if (!qfn) {
    throw new Error(`Query function ${queryFnName} not found in registry`);
  }

  if (type === 'dynamic' && !dynamicParams) {
    throw new Error(`Dynamic parameters are required for dynamic query functions`);
  }

  const qfnParams = type === 'dynamic' ? dynamicParams! : queryFnParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryFn = () => qfn(qfnParams as any);

  return {
    queryKey: qkeys,
    queryFn
  };
}

/**
 * Can convert a serializable RouteConfig into a StaticPageObject which our render process expects
 */
function mapRouteConfigurationToStaticPageObject<
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
 * NOTE
 *
 * How the old way worked:
 * - We had an array of pseudo-static page configurations with keys for:
 *  - queries: { queryKey, queryFn }[]
 *  - path (Routing)
 *  - styles (CSS)
 * -
 *
 * How the new way works:
 * -
 */

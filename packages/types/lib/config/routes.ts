import type {
  QueryFnName,
  SerializablePrefetchQueryOptions,
} from "../static/prefetch-query";
import type { ArcVersion } from "../version";

export enum ArcPageEnum {
  /** ARC v1 */
  HOME = "Home",
  ABOUT = "About",
  CONTACT = "Contact",
  POSTS = "Posts",
  POST = "Post",
  CIPHERS = "Ciphers",
  CIPHER = "Cipher",

  /** ARC v2 */
  v2_HOME = "v2_Home",
  v2_POSTS = "v2_Posts",
  v2_POST_DETAIL = "v2_Post_Detail",
  v2_ABOUT = "v2_About",
  v2_CONTACT = "v2_Contact"
}

export const ArcBrowserRuntimeRoutesEnum = {
  [ArcPageEnum.HOME]: "/archives/v1",
  [ArcPageEnum.ABOUT]: "/archives/v1/about",
  [ArcPageEnum.CONTACT]: "/archives/v1/contact",
  [ArcPageEnum.POSTS]: "/archives/v1/posts",
  [ArcPageEnum.POST]: "/archives/v1/post/:id",
  [ArcPageEnum.CIPHERS]: "/ee/ciphers",
  [ArcPageEnum.CIPHER]: "/ee/cipher/:id",

  [ArcPageEnum.v2_HOME]: "/",
  [ArcPageEnum.v2_POSTS]: "/posts",
  [ArcPageEnum.v2_POST_DETAIL]: "/post/:postId",
  [ArcPageEnum.v2_ABOUT]: "/about",
  [ArcPageEnum.v2_CONTACT]: "/contact"
} as const;

export type ArcBrowserRuntimeRoutes = typeof ArcBrowserRuntimeRoutesEnum;
export type ArcBrowserRuntimeRoutesEnumKeys = keyof ArcBrowserRuntimeRoutes;
export type ArcBrowserRuntimeRoutesEnumValues =
  ArcBrowserRuntimeRoutes[ArcBrowserRuntimeRoutesEnumKeys];

export enum ArcPrerenderStaticRouteEnum {
  HOME = "https://nickgalante.tech/archives/v1",
  CIPHERS = "https://nickgalante.tech/ee/ciphers",
  POSTS = "https://nickgalante.tech/archives/v1/posts",
  ABOUT = "https://nickgalante.tech/archives/v1/about",
  CONTACT = "https://nickgalante.tech/archives/v1/contact",

  v2_HOME = "https://nickgalante.tech/",
  v2_POSTS = "https://nickgalante.tech/posts",
  v2_ABOUT = "https://nickgalante.tech/about",
  v2_CONTACT = "https://nickgalante.tech/contact"
}

export enum ArcPrerenderDynamicRouteEnum {
  CIPHER = "https://nickgalante.tech/ee/cipher/:id",
  POST = "https://nickgalante.tech/archives/v1/post/:id",
  v2_POST_DETAIL = "https://nickgalante.tech/post/:postId",
}

export enum RouteConfigurationPathKeysEnum {
  Browser = "runtime/react-router/browser",
  Static = "prerender/react-router/static",
}

export const BASE_V1_CSS = [
  "/css/styles.min.css",
  "/css/themes/sb.min.css",
] as const;

export const BASE_V2_CSS = ["/css/v2.min.css"] as const;

export const VOID_V1_THEME_CSS = ["/css/themes/void/void.css"] as const;

export type RouteConfiguration<
  PrefetchQueryOptionsFnName extends QueryFnName,
  PrefetchQueryOptionsFnParams
> = {
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnumValues;
    [RouteConfigurationPathKeysEnum.Static]:
      | ArcPrerenderStaticRouteEnum
      | ArcPrerenderDynamicRouteEnum;
  };

  page: ArcPageEnum;
  version?: ArcVersion; 
  type: 'static' | 'dynamic';
  queries: SerializablePrefetchQueryOptions<
    PrefetchQueryOptionsFnName,
    PrefetchQueryOptionsFnParams
  >[];
  styles?: string[];
  index?: boolean;
};

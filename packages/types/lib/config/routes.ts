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
  v2_HOME = "v2_Home"
}

export const ArcBrowserRuntimeRoutesEnum = {
  [ArcPageEnum.HOME]: "/",
  [ArcPageEnum.ABOUT]: "/about",
  [ArcPageEnum.CONTACT]: "/contact",
  [ArcPageEnum.POSTS]: "/posts",
  [ArcPageEnum.POST]: "/post/:id",
  [ArcPageEnum.CIPHERS]: "/ee/ciphers",
  [ArcPageEnum.CIPHER]: "/ee/cipher/:id",
  
  [ArcPageEnum.v2_HOME]: "/v2"
} as const;

export type ArcBrowserRuntimeRoutes = typeof ArcBrowserRuntimeRoutesEnum;
export type ArcBrowserRuntimeRoutesEnumKeys = keyof ArcBrowserRuntimeRoutes;
export type ArcBrowserRuntimeRoutesEnumValues =
  ArcBrowserRuntimeRoutes[ArcBrowserRuntimeRoutesEnumKeys];

export enum ArcPrerenderStaticRouteEnum {
  HOME = "https://nickgalante.tech/",
  CIPHERS = "https://nickgalante.tech/ee/ciphers",
  POSTS = "https://nickgalante.tech/posts",
  ABOUT = "https://nickgalante.tech/about",
  CONTACT = "https://nickgalante.tech/contact",
  
  v2_HOME = "https://nickgalante.tech/v2"
}

export enum ArcPrerenderDynamicRouteEnum {
  CIPHER = "https://nickgalante.tech/ee/cipher/:id",
  POST = "https://nickgalante.tech/post/:id",
}

export enum RouteConfigurationPathKeysEnum {
  Browser = "runtime/react-router/browser",
  Static = "prerender/react-router/static",
}

export const BASE_V1_CSS = [
  "/css/styles.min.css",
  "/css/themes/sb.min.css",
] as const;

export const BASE_V2_CSS = ["/css/v2.css"] as const;

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

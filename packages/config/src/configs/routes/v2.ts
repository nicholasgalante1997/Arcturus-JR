import {
  type RouteConfiguration,
  RouteConfigurationPathKeysEnum,
  ArcPageEnum,
  ArcPrerenderStaticRouteEnum,
  ArcPrerenderDynamicRouteEnum,
  ArcBrowserRuntimeRoutesEnum,
  BASE_V2_CSS
} from "@arcjr/types";

export const V2_HomePageRouteConfiguration: Readonly<
  RouteConfiguration<"getPosts", {}>
> = {
  page: ArcPageEnum.v2_HOME,
  type: "static",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.v2_Home,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderStaticRouteEnum.v2_HOME,
  },
  index: true,
  styles: [...BASE_V2_CSS],
  queries: [
    {
      queryKey: ["posts"],
      queryFnName: "getPosts",
      queryFnParams: {},
    },
  ],
} as const;

export const V2_PostsPageRouteConfiguration: Readonly<
  RouteConfiguration<"getPosts", {}>
> = {
  page: ArcPageEnum.v2_POSTS,
  type: "static",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.v2_Posts,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderStaticRouteEnum.v2_POSTS,
  },
  styles: [...BASE_V2_CSS],
  queries: [
    {
      queryKey: ["posts"],
      queryFnName: "getPosts",
      queryFnParams: {},
    },
  ],
} as const;

export const V2_PostDetailPageRouteConfiguration: Readonly<
  RouteConfiguration<"getPost" | "getRelatedPosts", string>
> = {
  page: ArcPageEnum.v2_POST_DETAIL,
  type: "dynamic",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.v2_Post_Detail,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderDynamicRouteEnum.v2_POST_DETAIL,
  },
  styles: [...BASE_V2_CSS],
  queries: [
    {
      // We will dynamically append :postId into the queryKey during the static pre-rendering process
      queryKey: ["post"],
      queryFnName: "getPost",
      queryFnParams: ":postId",
    },
    {
      // We will dynamically append :postId into the queryKey during the static pre-rendering process
      queryKey: ["relatedPosts"],
      queryFnName: "getRelatedPosts",
      queryFnParams: ":postId",
    },
  ],
};

export const V2_AllRouteConfigurations = [
  // Static Page Config Objects
  V2_HomePageRouteConfiguration,
  V2_PostsPageRouteConfiguration,
  // Dynamic Page Config Objects
  V2_PostDetailPageRouteConfiguration
] as const;

export const V2_StaticRouteConfigurations = V2_AllRouteConfigurations.filter(
  (route) => route.type === "static"
);

export const V2_DynamicRouteConfigurations = V2_AllRouteConfigurations.filter(
  (route) => route.type === "dynamic"
);

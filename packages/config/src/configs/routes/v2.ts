import {
  type RouteConfiguration,
  RouteConfigurationPathKeysEnum,
  ArcPageEnum,
  ArcPrerenderStaticRouteEnum,
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

export const V2_AllRouteConfigurations = [
  // Static Page Config Objects
  V2_HomePageRouteConfiguration
] as const;

export const V2_StaticRouteConfigurations = V2_AllRouteConfigurations.filter(
  (route) => route.type === "static"
);

export const V2_DynamicRouteConfigurations = V2_AllRouteConfigurations.filter(
  (route) => route.type === "dynamic"
);

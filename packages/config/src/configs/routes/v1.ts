import {
  type RouteConfiguration,
  RouteConfigurationPathKeysEnum,
  ArcPageEnum,
  ArcPrerenderStaticRouteEnum,
  ArcPrerenderDynamicRouteEnum,
  ArcBrowserRuntimeRoutesEnum,
  BASE_V1_CSS,
  VOID_V1_THEME_CSS,
} from "@arcjr/types";

export const V1_HomePageRouteConfiguration: Readonly<
  RouteConfiguration<"getPosts" | "getMarkdown", "/content/home.md" | {}>
> = {
  page: ArcPageEnum.HOME,
  type: "static",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.Home,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderStaticRouteEnum.HOME,
  },
  index: true,
  styles: [...BASE_V1_CSS],
  queries: [
    {
      queryKey: ["markdown", "/content/home.md"],
      queryFnName: "getMarkdown",
      queryFnParams: "/content/home.md",
    },
    {
      queryKey: ["posts"],
      queryFnName: "getPosts",
      queryFnParams: {},
    },
  ],
} as const;

export const V1_AboutPageRouteConfiguration: Readonly<
  RouteConfiguration<"getMarkdown", "/content/about.md">
> = {
  page: ArcPageEnum.ABOUT,
  type: "static",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.About,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderStaticRouteEnum.ABOUT,
  },
  index: false,
  styles: [...BASE_V1_CSS, "/css/contact.min.css"],
  queries: [
    {
      queryKey: ["markdown", "/content/about.md"],
      queryFnName: "getMarkdown",
      queryFnParams: "/content/about.md",
    },
  ],
} as const;

export const V1_ContactPageRouteConfiguration: Readonly<
  RouteConfiguration<never, {}>
> = {
  page: ArcPageEnum.CONTACT,
  type: "static",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]:
      ArcBrowserRuntimeRoutesEnum.Contact,
    [RouteConfigurationPathKeysEnum.Static]:
      ArcPrerenderStaticRouteEnum.CONTACT,
  },
  index: false,
  styles: [...BASE_V1_CSS],
  queries: [],
} as const;

export const V1_PostsPageRouteConfiguration: Readonly<
  RouteConfiguration<"getPosts", {}>
> = {
  page: ArcPageEnum.POSTS,
  type: "static",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.Posts,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderStaticRouteEnum.POSTS,
  },
  index: false,
  styles: [...BASE_V1_CSS, "/css/post.min.css"],
  queries: [
    {
      queryKey: ["posts"],
      queryFnName: "getPosts",
      queryFnParams: {},
    },
  ],
} as const;

export const V1_PostPageRouteConfiguration: Readonly<
  RouteConfiguration<"getPost", string>
> = {
  page: ArcPageEnum.POST,
  type: "dynamic",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.Post,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderDynamicRouteEnum.POST,
  },
  index: false,
  styles: [...BASE_V1_CSS, "/css/post.min.css"],
  queries: [
    {
      // We will dynamically append :id into the queryKey during the static pre-rendering process
      queryKey: ["post"],
      queryFnName: "getPost",
      queryFnParams: ":id",
    },
  ],
};

export const V1_CiphersPageRouteConfiguration: Readonly<
  RouteConfiguration<"getCiphers", {}>
> = {
  page: ArcPageEnum.CIPHERS,
  type: "static",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]:
      ArcBrowserRuntimeRoutesEnum.Ciphers,
    [RouteConfigurationPathKeysEnum.Static]:
      ArcPrerenderStaticRouteEnum.CIPHERS,
  },
  index: false,
  styles: [...VOID_V1_THEME_CSS],
  queries: [
    {
      queryKey: ["ciphers"],
      queryFnName: "getCiphers",
      queryFnParams: {},
    },
  ],
} as const;

export const V1_CipherPageRouteConfiguration: Readonly<
  RouteConfiguration<"getCipher", string>
> = {
  page: ArcPageEnum.CIPHER,
  type: "dynamic",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]:
      ArcBrowserRuntimeRoutesEnum.Cipher,
    [RouteConfigurationPathKeysEnum.Static]:
      ArcPrerenderDynamicRouteEnum.CIPHER,
  },
  index: false,
  styles: [...VOID_V1_THEME_CSS],
  queries: [
    {
      // We will dynamically append :id into the queryKey during the static pre-rendering process
      queryKey: ["cipher"],
      queryFnName: "getCipher",
      queryFnParams: ":id",
    },
  ],
};

export const V1_AllRouteConfigurations = [
  // Static Page Config Objects
  V1_HomePageRouteConfiguration,
  V1_AboutPageRouteConfiguration,
  V1_ContactPageRouteConfiguration,
  V1_PostsPageRouteConfiguration,
  V1_CiphersPageRouteConfiguration,

  // Dynamic Page Config Objects
  V1_PostPageRouteConfiguration,
  V1_CipherPageRouteConfiguration,
] as const;

export const V1_StaticRouteConfigurations = V1_AllRouteConfigurations.filter(
  (route) => route.type === "static"
);

export const V1_DynamicRouteConfigurations = V1_AllRouteConfigurations.filter(
  (route) => route.type === "dynamic"
);

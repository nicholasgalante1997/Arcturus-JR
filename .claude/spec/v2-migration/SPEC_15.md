# SPEC-15: Route Migration

## Context

This spec defines the process for migrating routes from v1 to v2, including route configuration updates, lazy loading setup, prerender registration, and redirect handling. This ensures a smooth transition while maintaining existing functionality.

## Prerequisites

- SPEC-01 through SPEC-14 completed (all V2 components ready)
- React Router 7 configured
- Prerender script functional
- All V2 pages tested individually

## Requirements

### 1. Route Constants Update

Update `packages/config/src/configs/routes/constants.ts`:

```typescript
/**
 * Browser runtime routes (React Router paths)
 */
export enum ArcBrowserRuntimeRoutesEnum {
  // V1 Routes (deprecated)
  v1_Home = "/v1",
  v1_Posts = "/v1/posts",
  v1_Post = "/v1/post/:postId",
  v1_About = "/v1/about",
  v1_Contact = "/v1/contact",

  // V2 Routes (current)
  v2_Home = "/",
  v2_Posts = "/posts",
  v2_Post = "/post/:postId",
  v2_About = "/about",
  v2_Contact = "/contact",

  // Shared Routes
  NotFound = "*",
}

/**
 * Static prerender output paths
 */
export enum ArcPrerenderStaticRouteEnum {
  // V1 Routes
  v1_HOME = "/v1/index.html",
  v1_POSTS = "/v1/posts/index.html",
  v1_ABOUT = "/v1/about/index.html",
  v1_CONTACT = "/v1/contact/index.html",

  // V2 Routes
  v2_HOME = "/index.html",
  v2_POSTS = "/posts/index.html",
  v2_POST = "/post/[postId]/index.html",
  v2_ABOUT = "/about/index.html",
  v2_CONTACT = "/contact/index.html",

  // Shared
  NOT_FOUND = "/404.html",
}

/**
 * Page identifiers
 */
export enum ArcPageEnum {
  // V1 Pages
  v1_HOME = "v1_home",
  v1_POSTS = "v1_posts",
  v1_POST_DETAIL = "v1_post_detail",
  v1_ABOUT = "v1_about",
  v1_CONTACT = "v1_contact",

  // V2 Pages
  v2_HOME = "v2_home",
  v2_POSTS = "v2_posts",
  v2_POST_DETAIL = "v2_post_detail",
  v2_ABOUT = "v2_about",
  v2_CONTACT = "v2_contact",

  // Shared
  NOT_FOUND = "not_found",
}
```

### 2. V2 Route Configurations

Create `packages/config/src/configs/routes/v2.ts`:

```typescript
import type { RouteConfiguration } from "./types";
import {
  ArcBrowserRuntimeRoutesEnum,
  ArcPrerenderStaticRouteEnum,
  ArcPageEnum,
  RouteConfigurationPathKeysEnum,
} from "./constants";

// Base CSS for all V2 pages
const BASE_V2_CSS = [
  "/css/void/void.min.css",
  "/css/void/void-tailwind.min.css",
  "/css/layout/v2-app-layout.css",
  "/css/components/v2-header.css",
  "/css/components/v2-footer.css",
];

/**
 * V2 Home Page Configuration
 */
export const V2_HomePageRouteConfiguration: Readonly<RouteConfiguration> = {
  page: ArcPageEnum.v2_HOME,
  type: "static",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.v2_Home,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderStaticRouteEnum.v2_HOME,
  },
  index: true,
  styles: [...BASE_V2_CSS, "/css/pages/v2-home.css"],
  queries: [
    {
      queryKey: ["posts"],
      queryFnName: "getPosts",
      queryFnParams: {},
    },
  ],
} as const;

/**
 * V2 Posts Page Configuration
 */
export const V2_PostsPageRouteConfiguration: Readonly<RouteConfiguration> = {
  page: ArcPageEnum.v2_POSTS,
  type: "static",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.v2_Posts,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderStaticRouteEnum.v2_POSTS,
  },
  styles: [...BASE_V2_CSS, "/css/pages/v2-posts.css"],
  queries: [
    {
      queryKey: ["posts"],
      queryFnName: "getPosts",
      queryFnParams: {},
    },
  ],
} as const;

/**
 * V2 Post Detail Page Configuration
 */
export const V2_PostDetailRouteConfiguration: Readonly<RouteConfiguration> = {
  page: ArcPageEnum.v2_POST_DETAIL,
  type: "dynamic",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.v2_Post,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderStaticRouteEnum.v2_POST,
  },
  styles: [...BASE_V2_CSS, "/css/pages/v2-post-detail.css"],
  queries: [
    {
      queryKey: ["post", ":postId"],
      queryFnName: "getPost",
      queryFnParams: { postId: ":postId" },
    },
    {
      queryKey: ["relatedPosts", ":postId"],
      queryFnName: "getRelatedPosts",
      queryFnParams: { postId: ":postId" },
    },
  ],
} as const;

/**
 * V2 About Page Configuration
 */
export const V2_AboutPageRouteConfiguration: Readonly<RouteConfiguration> = {
  page: ArcPageEnum.v2_ABOUT,
  type: "static",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.v2_About,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderStaticRouteEnum.v2_ABOUT,
  },
  styles: [...BASE_V2_CSS, "/css/pages/v2-about.css"],
  queries: [], // Static page - no queries
} as const;

/**
 * V2 Contact Page Configuration
 */
export const V2_ContactPageRouteConfiguration: Readonly<RouteConfiguration> = {
  page: ArcPageEnum.v2_CONTACT,
  type: "static",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.v2_Contact,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderStaticRouteEnum.v2_CONTACT,
  },
  styles: [...BASE_V2_CSS, "/css/pages/v2-contact.css"],
  queries: [], // Static page - no queries
} as const;

/**
 * All V2 Route Configurations
 */
export const V2_ROUTES = [
  V2_HomePageRouteConfiguration,
  V2_PostsPageRouteConfiguration,
  V2_PostDetailRouteConfiguration,
  V2_AboutPageRouteConfiguration,
  V2_ContactPageRouteConfiguration,
] as const;

export default V2_ROUTES;
```

### 3. Router Configuration

Update `apps/web/src/router/routes.tsx`:

```tsx
import { lazy } from "react";
import type { RouteObject } from "react-router";

// V2 Page Components (lazy loaded)
const V2HomePage = lazy(
  () => import(/* webpackChunkName: "v2-home" */ "@/pages/v2_Home")
);
const V2PostsPage = lazy(
  () => import(/* webpackChunkName: "v2-posts" */ "@/pages/v2_Posts")
);
const V2PostDetailPage = lazy(
  () => import(/* webpackChunkName: "v2-post-detail" */ "@/pages/v2_PostDetail")
);
const V2AboutPage = lazy(
  () => import(/* webpackChunkName: "v2-about" */ "@/pages/v2_About")
);
const V2ContactPage = lazy(
  () => import(/* webpackChunkName: "v2-contact" */ "@/pages/v2_Contact")
);

// V1 Page Components (deprecated, lazy loaded for legacy support)
const V1HomePage = lazy(
  () => import(/* webpackChunkName: "v1-home" */ "@/pages/v1_Home")
);
const V1PostsPage = lazy(
  () => import(/* webpackChunkName: "v1-posts" */ "@/pages/v1_Posts")
);
const V1PostDetailPage = lazy(
  () => import(/* webpackChunkName: "v1-post-detail" */ "@/pages/v1_PostDetail")
);
const V1AboutPage = lazy(
  () => import(/* webpackChunkName: "v1-about" */ "@/pages/v1_About")
);
const V1ContactPage = lazy(
  () => import(/* webpackChunkName: "v1-contact" */ "@/pages/v1_Contact")
);

// Shared
const NotFoundPage = lazy(
  () => import(/* webpackChunkName: "not-found" */ "@/pages/NotFound")
);

/**
 * V2 Routes (Primary)
 */
export const v2Routes: RouteObject[] = [
  {
    path: "/",
    element: <V2HomePage />,
    index: true,
  },
  {
    path: "/posts",
    element: <V2PostsPage />,
  },
  {
    path: "/post/:postId",
    element: <V2PostDetailPage />,
  },
  {
    path: "/about",
    element: <V2AboutPage />,
  },
  {
    path: "/contact",
    element: <V2ContactPage />,
  },
];

/**
 * V1 Routes (Legacy, prefixed with /v1)
 */
export const v1Routes: RouteObject[] = [
  {
    path: "/v1",
    element: <V1HomePage />,
  },
  {
    path: "/v1/posts",
    element: <V1PostsPage />,
  },
  {
    path: "/v1/post/:postId",
    element: <V1PostDetailPage />,
  },
  {
    path: "/v1/about",
    element: <V1AboutPage />,
  },
  {
    path: "/v1/contact",
    element: <V1ContactPage />,
  },
];

/**
 * All Application Routes
 */
export const routes: RouteObject[] = [
  ...v2Routes,
  ...v1Routes,
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default routes;
```

### 4. Page Components

Create thin page wrapper components:

`apps/web/src/pages/v2_Home.tsx`:
```tsx
import { V2HomePage } from "@/components/v2/Home";
import { PageWrapper } from "@/layout/v2/PageWrapper";

export default function V2HomeRoute() {
  return (
    <PageWrapper transparentHeader>
      <V2HomePage />
    </PageWrapper>
  );
}
```

`apps/web/src/pages/v2_Posts.tsx`:
```tsx
import { V2PostsPage } from "@/components/v2/Posts";
import { PageWrapper } from "@/layout/v2/PageWrapper";

export default function V2PostsRoute() {
  return (
    <PageWrapper>
      <V2PostsPage />
    </PageWrapper>
  );
}
```

`apps/web/src/pages/v2_PostDetail.tsx`:
```tsx
import { V2PostDetail } from "@/components/v2/PostDetail";
import { PageWrapper } from "@/layout/v2/PageWrapper";

export default function V2PostDetailRoute() {
  return (
    <PageWrapper>
      <V2PostDetail />
    </PageWrapper>
  );
}
```

`apps/web/src/pages/v2_About.tsx`:
```tsx
import { V2AboutPage } from "@/components/v2/About";
import { PageWrapper } from "@/layout/v2/PageWrapper";

export default function V2AboutRoute() {
  return (
    <PageWrapper>
      <V2AboutPage />
    </PageWrapper>
  );
}
```

`apps/web/src/pages/v2_Contact.tsx`:
```tsx
import { V2ContactPage } from "@/components/v2/Contact";
import { PageWrapper } from "@/layout/v2/PageWrapper";

export default function V2ContactRoute() {
  return (
    <PageWrapper>
      <V2ContactPage />
    </PageWrapper>
  );
}
```

### 5. Prerender Pages Configuration

Update `scripts/lib/pages.ts`:

```typescript
import {
  V2_HomePageRouteConfiguration,
  V2_PostsPageRouteConfiguration,
  V2_PostDetailRouteConfiguration,
  V2_AboutPageRouteConfiguration,
  V2_ContactPageRouteConfiguration,
} from "@arcjr/config/routes/v2";
import { getPosts } from "@/data/posts";

import type { PageConfiguration } from "./types";

/**
 * Generate all page configurations for prerendering
 */
export async function getPageConfigurations(): Promise<PageConfiguration[]> {
  const pages: PageConfiguration[] = [];

  // Static V2 Pages
  pages.push({
    ...V2_HomePageRouteConfiguration,
    outputPath: "/index.html",
    browserPath: "/",
  });

  pages.push({
    ...V2_PostsPageRouteConfiguration,
    outputPath: "/posts/index.html",
    browserPath: "/posts",
  });

  pages.push({
    ...V2_AboutPageRouteConfiguration,
    outputPath: "/about/index.html",
    browserPath: "/about",
  });

  pages.push({
    ...V2_ContactPageRouteConfiguration,
    outputPath: "/contact/index.html",
    browserPath: "/contact",
  });

  // Dynamic V2 Pages - Post Detail
  const posts = await getPosts();
  for (const post of posts) {
    pages.push({
      ...V2_PostDetailRouteConfiguration,
      outputPath: `/post/${post.id}/index.html`,
      browserPath: `/post/${post.id}`,
      params: { postId: post.id },
    });
  }

  return pages;
}

export default getPageConfigurations;
```

### 6. Redirect Configuration

Create `apps/web/src/router/redirects.ts`:

```typescript
/**
 * Redirect mappings for backwards compatibility
 * Old V1 paths -> New V2 paths
 */
export const REDIRECTS: Record<string, string> = {
  // Direct mappings
  "/home": "/",
  "/blog": "/posts",
  "/blog/:postId": "/post/:postId",
  "/articles": "/posts",

  // Old path patterns
  "/posts/:postId": "/post/:postId",
};

/**
 * Check if a path should redirect
 */
export function getRedirectPath(path: string): string | null {
  // Exact match
  if (REDIRECTS[path]) {
    return REDIRECTS[path];
  }

  // Pattern matching for dynamic routes
  for (const [pattern, target] of Object.entries(REDIRECTS)) {
    if (pattern.includes(":")) {
      const patternRegex = new RegExp(
        "^" + pattern.replace(/:(\w+)/g, "([^/]+)") + "$"
      );
      const match = path.match(patternRegex);
      if (match) {
        // Replace params in target
        let result = target;
        const paramNames = (pattern.match(/:(\w+)/g) || []).map((p) =>
          p.slice(1)
        );
        paramNames.forEach((name, index) => {
          result = result.replace(`:${name}`, match[index + 1]);
        });
        return result;
      }
    }
  }

  return null;
}
```

### 7. Redirect Component

Create `apps/web/src/components/Base/RedirectHandler/Component.tsx`:

```tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { getRedirectPath } from "@/router/redirects";

/**
 * Handles redirects from old URLs to new V2 URLs
 * Place at the top level of your app
 */
export function RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTo = getRedirectPath(location.pathname);
    if (redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
}

export default RedirectHandler;
```

### 8. Update App Entry

Update `apps/web/src/App.tsx`:

```tsx
import { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router";

import { QueryProvider } from "@/providers/QueryProvider";
import { RedirectHandler } from "@/components/Base/RedirectHandler";
import routes from "@/router/routes";

const router = createBrowserRouter(routes);

function App() {
  return (
    <QueryProvider>
      <RedirectHandler />
      <Suspense fallback={<div className="v2-page-loading" />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryProvider>
  );
}

export default App;
```

## Migration Checklist

### Phase 1: Preparation
- [ ] All V2 components completed and tested
- [ ] Route configurations defined
- [ ] CSS files in correct locations
- [ ] Data fetching hooks working

### Phase 2: Router Setup
- [ ] Route constants updated
- [ ] V2 route configurations created
- [ ] Router configuration updated
- [ ] Page wrapper components created

### Phase 3: Prerender Setup
- [ ] Page configurations updated
- [ ] Dynamic pages generating correctly
- [ ] Static pages generating correctly
- [ ] All queries prefetching properly

### Phase 4: Redirect Handling
- [ ] Redirect mappings defined
- [ ] RedirectHandler component working
- [ ] Old URLs redirect to new URLs
- [ ] No broken links

### Phase 5: Cleanup
- [ ] Remove unused V1 code (after transition period)
- [ ] Update internal links to V2 paths
- [ ] Update sitemap
- [ ] Update external documentation

## Acceptance Criteria

- [ ] All V2 routes accessible and rendering
- [ ] V1 routes accessible at /v1 prefix (temporary)
- [ ] Dynamic routes (/post/:postId) working
- [ ] Lazy loading functioning for all pages
- [ ] Prerendering generates all static files
- [ ] Query prefetching working (no hanging)
- [ ] Redirects working for old URLs
- [ ] 404 page displays for unknown routes
- [ ] Navigation between pages works
- [ ] Back/forward browser navigation works

## Notes

- Keep V1 routes during transition period
- Consider 301 redirects at server level for SEO
- Monitor 404s to catch missed redirects
- Update external links pointing to old URLs
- Sitemap should only include V2 URLs
- robots.txt should block /v1 after transition

## Verification

```bash
# Build and test all routes
bun run build
bun run serve

# Test each route
curl -I http://localhost:4200/
curl -I http://localhost:4200/posts
curl -I http://localhost:4200/post/1
curl -I http://localhost:4200/about
curl -I http://localhost:4200/contact

# Test redirects
curl -I http://localhost:4200/blog  # Should redirect to /posts

# Test 404
curl -I http://localhost:4200/nonexistent

# Check prerendered files
ls -la dist/
ls -la dist/posts/
ls -la dist/post/
```

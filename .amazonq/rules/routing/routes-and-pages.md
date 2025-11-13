# Routing and Page Creation Rules

## Purpose
Define standards for creating routes and pages using React Router 7 with lazy loading and code splitting.

## Priority
**High**

## Instructions

### Route Configuration

**ALWAYS** define routes in `src/routes/routes.tsx` using `RouteObject` type (ID: ROUTE_OBJECTS)

**ALWAYS** use lazy loading with `createLazyRouteConfiguration` utility (ID: LAZY_ROUTES)

**ALWAYS** use index routes for root paths (ID: INDEX_ROUTES)

```typescript
// src/routes/routes.tsx
import { type RouteObject } from 'react-router';
import { createLazyRouteConfiguration } from './utils/lazy';

const routes: RouteObject[] = [
  {
    path: '/',
    lazy: createLazyRouteConfiguration('Home'),
    index: true
  },
  {
    path: '/posts',
    lazy: createLazyRouteConfiguration('Posts')
  },
  {
    path: '/post/:id',
    lazy: createLazyRouteConfiguration('Post')
  }
];
```

**ALWAYS** use kebab-case for route paths (ID: KEBAB_PATHS)

**ALWAYS** use `:param` syntax for dynamic route parameters (ID: DYNAMIC_PARAMS)

### Lazy Route Configuration

**ALWAYS** use `createLazyRouteConfiguration` for code splitting (ID: LAZY_CONFIG)

**NEVER** import page components directly in routes file (ID: NO_DIRECT_IMPORTS)

```typescript
// src/routes/utils/lazy.tsx
export function createLazyRouteConfiguration(page: string): LazyRouteObject {
  return {
    Component: async () =>
      (
        await import(
          /* webpackChunkName: "[request]~chunk" */
          /* webpackMode: "lazy" */
          /* webpackPrefetch: true */
          '@/pages/' + page
        )
      ).default
  };
}
```

### Page Component Structure

**ALWAYS** create page components in `src/pages/` directory (ID: PAGES_DIR)

**ALWAYS** name page files with PascalCase matching route name (ID: PASCAL_CASE)

**ALWAYS** export page component as default export (ID: DEFAULT_EXPORT)

**ALWAYS** wrap page content with `AppLayout` component (ID: APP_LAYOUT)

```typescript
// src/pages/Home.tsx
import React from 'react';
import { Home } from '@/components/Home';
import { AppLayout } from '@/layout/Layout';

function HomePage() {
  return (
    <AppLayout>
      <Home />
    </AppLayout>
  );
}

export default React.memo(HomePage);
```

**ALWAYS** wrap page component with `React.memo` (ID: MEMO_PAGES)

**ALWAYS** keep page components thin - delegate to feature components (ID: THIN_PAGES)

### Dynamic Routes

**ALWAYS** use `useParams()` hook to access route parameters (ID: USE_PARAMS)

**ALWAYS** validate route parameters before using (ID: VALIDATE_PARAMS)

```typescript
// src/pages/Post.tsx
import { useParams } from 'react-router';

function PostPage() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    throw new Error('Post ID is required');
  }
  
  return (
    <AppLayout>
      <Post id={id} />
    </AppLayout>
  );
}
```

### Adding New Routes Checklist

When adding a new route, **ALWAYS** complete these steps (ID: NEW_ROUTE_CHECKLIST):

1. Add route to `src/routes/routes.tsx` with lazy configuration
2. Create page component in `src/pages/PageName.tsx`
3. Create feature component in `src/components/PageName/`
4. Add page configuration to `scripts/lib/pages.ts` with queries
5. Add route constant to `scripts/lib/routes.ts`
6. Test prerendering with `bun run build`

### Route Constants

**ALWAYS** define route paths as constants in `scripts/lib/routes.ts` (ID: ROUTE_CONSTANTS)

**ALWAYS** separate dynamic and non-dynamic routes (ID: SEPARATE_ROUTES)

```typescript
// scripts/lib/routes.ts
export const NON_DYNAMIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  POSTS: '/posts'
} as const;

export const DYNAMIC_ROUTES = {
  POST: '/post/:id',
  CIPHER: '/ee/cipher/:id'
} as const;
```

### Prerender Configuration

**ALWAYS** add new routes to `scripts/lib/pages.ts` for prerendering (ID: PRERENDER_CONFIG)

**ALWAYS** include all required queries for the route (ID: ROUTE_QUERIES)

**ALWAYS** include all CSS styles needed for the route (ID: ROUTE_STYLES)

```typescript
// scripts/lib/pages.ts
{
  path: NON_DYNAMIC_ROUTES.POSTS,
  queries: [
    {
      queryKey: ['posts'],
      queryFn: () => getPosts()
    }
  ],
  styles: [...BASE_CSS_STYLES, '/css/post.min.css']
}
```

## Error Handling

If route parameters are missing or invalid, throw descriptive errors. Use React Router's error boundaries to handle route-level errors gracefully.

## Examples

### Complete New Route Example

```typescript
// 1. src/routes/routes.tsx
{
  path: '/projects',
  lazy: createLazyRouteConfiguration('Projects')
}

// 2. src/pages/Projects.tsx
import React from 'react';
import { Projects } from '@/components/Projects';
import { AppLayout } from '@/layout/Layout';

function ProjectsPage() {
  return (
    <AppLayout>
      <Projects />
    </AppLayout>
  );
}

export default React.memo(ProjectsPage);

// 3. scripts/lib/routes.ts
export const NON_DYNAMIC_ROUTES = {
  // ...
  PROJECTS: '/projects'
} as const;

// 4. scripts/lib/pages.ts
{
  path: NON_DYNAMIC_ROUTES.PROJECTS,
  queries: [
    {
      queryKey: ['projects'],
      queryFn: () => getProjects()
    }
  ],
  styles: [...BASE_CSS_STYLES]
}
```

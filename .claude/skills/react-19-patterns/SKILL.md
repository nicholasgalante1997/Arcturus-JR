---
name: react-19-patterns
description: React 19 patterns including SSR, Suspense, use() API, and automatic JSX runtime. Covers server-side rendering, hydration, and suspenseful data fetching.
tags:
  - react
  - ssr
  - suspense
  - data-fetching
---

# React 19 Patterns Skill

## Overview

This skill provides comprehensive patterns for React 19 development, focusing on server-side rendering, the `use()` API, and suspenseful data fetching patterns used in Arc-Jr.

## Key Patterns

### Automatic JSX Runtime

React 19 uses automatic JSX runtime - no need to import React:

```typescript
// Good - no React import needed
function Component() {
  return <div>Hello</div>;
}

// Still valid but unnecessary
import React from 'react';
function Component() {
  return <div>Hello</div>;
}
```

### use() API for Suspenseful Data

React 19's `use()` API unwraps promises and triggers Suspense:

```typescript
import { use } from 'react';

function Component({ queryPromise }) {
  // This suspends until promise resolves
  const data = use(queryPromise);
  return <div>{data.title}</div>;
}
```

### Server-Side Rendering with prerender()

Use `prerender()` from `react-dom/static.edge` for build-time rendering:

```typescript
import { prerender } from 'react-dom/static.edge';

const { prelude } = await prerender(
  <App />,
  {
    bootstrapModules: ['./client.js'],
    bootstrapScriptContent: 'window.__STATE__ = {...}'
  }
);
```

### Hydration on Client

Use `hydrateRoot` to hydrate prerendered markup:

```typescript
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

### Error Boundaries with Suspense

Combine Error Boundaries with Suspense for complete error handling:

```typescript
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function Page() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<Loader />}>
        <Content />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## TanStack Query Integration

### Server-Side Prefetching

Prefetch queries during prerender:

```typescript
const queryClient = new QueryClient();

await queryClient.prefetchQuery({
  queryKey: ['posts'],
  queryFn: () => getPosts()
});

const dehydrated = dehydrate(queryClient);
```

### Isomorphic Hooks

Create hooks that work on both server and client:

```typescript
export function useGetPosts(): UseQueryResult<Post[], Error> {
  const queryClient = useQueryClient();
  const queryKey = ['posts'];

  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey) as Post[];
    return { data, promise: Promise.resolve(data) } as UseQueryResult<Post[], Error>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getPosts()
  });
}
```

### State Dehydration

Dehydrate QueryClient state for client rehydration:

```typescript
const dehydrated = dehydrate(queryClient);

// Inject into HTML
const script = `window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydrated)}`;

// Client-side rehydration
const queryClient = new QueryClient();
hydrate(queryClient, window.__REACT_QUERY_STATE__);
```

## Component Patterns

### Container/View Separation

Separate data fetching from presentation:

```typescript
// Container.tsx - handles data fetching
function Home() {
  const posts = useGetPosts();
  return (
    <SuspenseEnabledQueryProvider>
      <HomeView queries={[posts]} />
    </SuspenseEnabledQueryProvider>
  );
}

// View.tsx - pure presentation
function HomeView({ queries }) {
  const [_posts] = queries;
  const posts = use(_posts.promise);
  return <PostsList posts={posts} />;
}
```

### Pipeline Composition

Use pipeline utility for HOC composition:

```typescript
import { pipeline } from '@/utils/pipeline';

export default pipeline(
  React.memo,
  withErrorBoundary,
  withSuspense
)(Component);
```

## Critical Constraints

### Prerender Hanging

**CRITICAL**: Every `useQuery` call must be prefetched during prerender. Missing even one query will cause prerender to hang indefinitely on an unresolved promise.

Always verify:
1. Query is added to page configuration in `scripts/lib/pages.ts`
2. Query key matches between prefetch and hook
3. Query function is properly defined
4. All queries are prefetched before rendering

### No Conditional Hooks

Never call hooks conditionally:

```typescript
// Bad - conditional hook
if (condition) {
  const data = useQuery(...);
}

// Good - hook at top level
const data = useQuery(...);
if (condition) {
  // use data
}
```

### Dependency Arrays

Always include proper dependency arrays:

```typescript
// Good
useEffect(() => {
  // effect
}, [dependency]);

// Bad - missing dependencies
useEffect(() => {
  // effect
}, []);
```

## Best Practices

1. **Always use Suspense boundaries** around components using `use()`
2. **Prefetch all queries** during prerender to avoid hanging
3. **Use Error Boundaries** for error handling
4. **Keep Views pure** - no side effects in View components
5. **Use React.memo** for expensive components
6. **Type everything** - no implicit any
7. **Test Suspense** - verify loading states work correctly

---
name: tanstack-query-ssr
description: TanStack Query patterns for server-side rendering, prefetching, dehydration, and isomorphic data fetching with React 19.
tags:
  - tanstack-query
  - data-fetching
  - ssr
  - prefetching
---

# TanStack Query Data Fetching Rules

## Purpose

Define standards for asynchronous data fetching using TanStack Query with React 19's `use()` API and the experimental suspenseful pattern.

## Priority

**Critical**

## Critical Requirements

### Prefetch Everything

**CRITICAL**: Every query used in a component must be prefetched during prerender.

Checklist:

- [ ] Query is defined in page configuration
- [ ] Query key matches between prefetch and hook
- [ ] Query function is properly defined
- [ ] All queries are prefetched before rendering
- [ ] No unresolved promises in component tree

### Validation

Always validate data on server-side:

```typescript
if (getJavascriptEnvironment() === 'server') {
  const data = queryClient.getQueryData(queryKey);
  
  // Validate type
  if (!isValidType(data)) {
    throw new Error(`Invalid data type for ${queryKey}`);
  }
  
  return { data, promise: Promise.resolve(data) };
}
```

### Error Handling

Handle errors gracefully:

```typescript
try {
  const data = await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => fetchData()
  });
} catch (error) {
  console.error(`Failed to prefetch ${queryKey}:`, error);
  throw error;
}
```

## Best Practices

1. **Export both function and hook** - enables reuse and testing
2. **Use consistent query keys** - prevents cache misses
3. **Validate server data** - catch prefetch issues early
4. **Prefetch concurrently** - use Promise.all for performance
5. **Type everything** - no implicit any in hooks
6. **Document query requirements** - help future developers
7. **Test prefetching** - verify prerender completes
8. **Monitor query performance** - track prefetch times

## Core Concepts

### Prefetching Pattern

Prefetch all queries during prerender:

```typescript
const queryClient = new QueryClient();

// Prefetch multiple queries concurrently
await Promise.all([
  queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts()
  }),
  queryClient.prefetchQuery({
    queryKey: ['markdown', '/content/home.md'],
    queryFn: () => getMarkdown('/content/home.md')
  })
]);
```

### Dehydration & Rehydration

Dehydrate on server, rehydrate on client:

```typescript
// Server-side
const dehydrated = dehydrate(queryClient);
const script = `window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydrated)}`;

// Client-side
import { hydrate } from '@tanstack/react-query';

const queryClient = new QueryClient();
hydrate(queryClient, window.__REACT_QUERY_STATE__);
```

## Isomorphic Hooks

### Basic Pattern

Create hooks that detect environment and behave accordingly:

```typescript
import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getPosts() {
  return new PostsService().fetchPosts();
}

export function useGetPosts(): UseQueryResult<Post[], Error> {
  const queryClient = useQueryClient();
  const queryKey = ['posts'];

  // Server-side: return prefetched data
  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey) as Post[];
    
    // Validate data
    if (!Array.isArray(data)) {
      throw new Error(`data from query prefetch ${queryKey} is not an array.`);
    }
    
    // Return with promise for use() API
    return { data, promise: Promise.resolve(data) } as UseQueryResult<Post[], Error>;
  }

  // Client-side: return standard useQuery
  return useQuery({
    queryKey,
    queryFn: () => getPosts()
  });
}
```

### Dynamic Route Pattern

Handle dynamic parameters in hooks:

```typescript
export function usePost(id: string): UseQueryResult<Post, Error> {
  const queryClient = useQueryClient();
  const queryKey = ['post', id];

  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey) as Post;
    
    if (!isPost(data)) {
      throw new Error(`data from query prefetch ${queryKey} is not a Post.`);
    }
    
    return { data, promise: Promise.resolve(data) } as UseQueryResult<Post, Error>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getPost(id)
  });
}
```

## Page Configuration

### Adding Queries to Pages

Update this for our new Routes Config pattern.

### Dynamic Routes

Map dynamic parameters when creating page objects:

```typescript
// For each post ID, create a page configuration
slugs.map((postId) => ({
  path: DYNAMIC_ROUTES.POST.replace(':id', encodeURIComponent(postId)),
  queries: [
    {
      queryKey: ['post', postId],
      queryFn: () => getPost(postId)
    }
  ],
  styles: [...BASE_CSS_STYLES, '/css/post.min.css']
}))
```

## Service Classes

### Creating Data Services

Organize data fetching in service classes:

```typescript
export default class PostsService {
  private readonly baseUrl = '/content';

  async fetchPosts(): Promise<Post[]> {
    const response = await fetch(`${this.baseUrl}/posts.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    return response.json();
  }

  async fetchPost(id: string): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts/${id}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post ${id}: ${response.statusText}`);
    }
    return response.json();
  }
}
```

## Component Integration

### Using Queries in Components

Combine hooks with React 19's `use()` API:

```typescript
// Container component
function Home() {
  const markdown = useMarkdown('/content/home.md');
  const posts = useGetPosts();
  
  return (
    <SuspenseEnabledQueryProvider>
      <HomeView queries={[markdown, posts]} />
    </SuspenseEnabledQueryProvider>
  );
}

// View component
function HomeView({ queries }: HomeViewProps) {
  const [_markdown, _posts] = queries;
  const markdown = use(_markdown.promise);
  const posts = use(_posts.promise);
  
  return (
    <div>
      <Markdown markdown={markdown.markdown} />
      <PostsList posts={posts} />
    </div>
  );
}
```

## Hook Pattern

**ALWAYS** create custom hooks that return `UseQueryResult` with server/client branching (ID: HOOK_PATTERN)

```typescript
import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getPosts() {
  return new PostsService().fetchPosts();
}

export function useGetPosts(): UseQueryResult<Post[], Error> {
  const queryClient = useQueryClient();
  const queryKey = ['posts'];

  // Server-side: return prefetched data from QueryClient
  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey) as Post[];
    
    // Validate data
    if (!Array.isArray(data)) {
      throw new Error(`data from query prefetch ${queryKey} is not an array.`);
    }
    
    return { data, promise: Promise.resolve(data) } as UseQueryResult<Post[], Error>;
  }

  // Client-side: return standard useQuery result
  return useQuery({
    queryKey,
    queryFn: () => getPosts()
  });
}
```

**ALWAYS** export both the data fetching function and the hook (ID: EXPORT_BOTH)

**ALWAYS** use `getJavascriptEnvironment()` to detect server vs client (ID: ENV_DETECTION)

**ALWAYS** validate data on server-side before returning (ID: VALIDATE_SERVER_DATA)

**ALWAYS** return `{ data, promise: Promise.resolve(data) }` on server (ID: SERVER_RETURN_PROMISE)

### Query Keys

**ALWAYS** use consistent queryKey between prefetch and hook (ID: CONSISTENT_KEYS)

**ALWAYS** use array format for queryKey: `['posts']` or `['post', id]` (ID: ARRAY_KEYS)

**ALWAYS** include dynamic parameters in queryKey: `['markdown', file]` (ID: DYNAMIC_KEYS)

### Component Pattern with SuspenseEnabledQueryProvider

**ALWAYS** wrap view components with `SuspenseEnabledQueryProvider` (ID: SEQ_WRAPPER)

**ALWAYS** call hooks in parent component, pass results to view (ID: HOOKS_IN_PARENT)

**ALWAYS** use React 19's `use()` API to unwrap promises in view (ID: USE_API)

```typescript
// Component.tsx
import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useMarkdown } from '@/hooks/useMarkdown';
import { useGetPosts } from '@/hooks/usePosts';

function Home() {
  const markdown = useMarkdown('/content/home.md');
  const posts = useGetPosts();
  return (
    <SuspenseEnabledQueryProvider>
      <HomeView queries={[markdown, posts]} />
    </SuspenseEnabledQueryProvider>
  );
}

// View.tsx
import { use } from 'react';

function HomeView({ queries }: HomeViewProps) {
  const [_markdown, _posts] = queries;
  const markdown = use(_markdown.promise); // Suspends until resolved
  const posts = use(_posts.promise);
  return (
    <div>
      <Markdown markdown={markdown.markdown} />
      <PostCardsList posts={posts} />
    </div>
  );
}
```

**NEVER** use `isLoading` or `isError` checks in components (ID: NO_LOADING_CHECKS)

**NEVER** use conditional rendering for loading states (ID: NO_CONDITIONAL_LOADING)

## Type Definitions

**ALWAYS** define proper types for query results (ID: TYPE_QUERY_RESULTS)

```typescript
import { UseQueryResult } from '@tanstack/react-query';
import { MarkdownDocument, Post } from '@/types';

type MarkdownQuery = UseQueryResult<MarkdownDocument>;
type PostsQuery = UseQueryResult<Post[]>;

export interface HomeViewProps {
  queries: [MarkdownQuery, PostsQuery];
}
```

## Data Fetching Services

**ALWAYS** create service classes for data fetching logic (ID: SERVICE_CLASSES)

**ALWAYS** keep hooks thin - delegate to services (ID: THIN_HOOKS)

```typescript
// services/Posts.ts
export default class PostsService {
  async fetchPosts(): Promise<Post[]> {
    const response = await fetch('/content/posts.json');
    return response.json();
  }
}

// hooks/usePosts.ts
export async function getPosts() {
  return new PostsService().fetchPosts();
}
```

## Prefetching Requirements

**ALWAYS** prefetch every query used in a route during prerender (ID: PREFETCH_ALL)

**ALWAYS** add new queries to `scripts/lib/pages.ts` page configuration (ID: ADD_TO_PAGES)

**NEVER** add a useQuery hook without adding corresponding prefetch (ID: NO_UNPREFETCHED_HOOKS)

## Error Handling

If data validation fails on server, throw descriptive errors with queryKey information. This helps debug prefetch mismatches during prerender.

## Examples

### Dynamic Route Hook

```typescript
export function usePost(id: string): UseQueryResult<Post, Error> {
  const queryClient = useQueryClient();
  const queryKey = ['post', id];

  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey) as Post;
    if (!isPost(data)) {
      throw new Error(`data from query prefetch ${queryKey} is not a Post.`);
    }
    return { data, promise: Promise.resolve(data) } as UseQueryResult<Post, Error>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getPost(id)
  });
}
```

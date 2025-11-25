---
name: tanstack-query-ssr
description: TanStack Query patterns for server-side rendering, prefetching, dehydration, and isomorphic data fetching with React 19.
tags:
  - tanstack-query
  - data-fetching
  - ssr
  - prefetching
---

# TanStack Query SSR Skill

## Overview

This skill covers TanStack Query patterns for server-side rendering, including prefetching, dehydration, rehydration, and isomorphic hooks that work on both server and client.

## Core Concepts

### Query Keys

Always use consistent query keys between prefetch and hook:

```typescript
// Define once
const QUERY_KEYS = {
  posts: () => ['posts'],
  post: (id: string) => ['post', id],
  markdown: (file: string) => ['markdown', file]
} as const;

// Use in prefetch
await queryClient.prefetchQuery({
  queryKey: QUERY_KEYS.posts(),
  queryFn: () => getPosts()
});

// Use in hook
export function useGetPosts() {
  return useQuery({
    queryKey: QUERY_KEYS.posts(),
    queryFn: () => getPosts()
  });
}
```

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

Define all queries for a page in `scripts/lib/pages.ts`:

```typescript
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
}
```

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

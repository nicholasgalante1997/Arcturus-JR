---
name: prerendering
description: React 19 prerendering with 'react-dom/static.edge' in the bun runtime.
tags:
  - react
  - ssr
  - suspense
  - data-fetching
---

# Prerendering Rules

## Purpose

Define standards for server-side rendering (SSR) and prerendering React components using React 19's experimental `prerender` API in the Bun runtime. Based on the actual implementation in `scripts/prerender.tsx`.

## Priority

**Critical**

## Instructions

### Core Prerender Pattern

**ALWAYS** use React 19's `prerender` API from `react-dom/static.edge` (ID: PRERENDER_API)

**ALWAYS** prefetch ALL data using TanStack Query before rendering each route (ID: PREFETCH_ALL_DATA)

**NEVER** render routes without prefetching required data - this will cause the prerender function to hang forever on unresolved Suspenseful promises (ID: NO_UNPREFETCHED_ROUTES)

**ALWAYS** dehydrate QueryClient state and inject into HTML as `window.__REACT_QUERY_STATE__` (ID: DEHYDRATE_STATE)

### Implementation Pattern from scripts/prerender.tsx

```typescript
// 1. Create StaticHandler for routes
const { query, dataRoutes } = createStaticHandler(lazyRoutes());

// 2. For each page, create fresh QueryClient
const queryClient = new QueryClient();

// 3. Prefetch ALL queries concurrently
await Promise.all(
  queries.map((q) =>
    queryClient.prefetchQuery({
      queryKey: q.queryKey,
      queryFn: q.queryFn
    })
  )
);

// 4. Dehydrate the saturated QueryClient
const dehydrated = dehydrate(queryClient);

// 5. Create mock request and static context
const mockRequest = createMockRequest(path);
const staticContext = await query(mockRequest);

// 6. Create StaticRouter
const router = createStaticRouter(dataRoutes, staticContext);

// 7. Prerender with Document wrapper
const { prelude } = await prerender(
  <Document styles={styles.map(mapHREFToReactLinkJSX)}>
    <App
      layers={{
        data: { javascriptRuntime: 'server', server: { client: queryClient } },
        router: { javascriptRuntime: 'server', server: { router, context: staticContext } }
      }}
    />
  </Document>,
  {
    bootstrapModules: getBrowserESMBundles(),
    bootstrapScriptContent: createDehydrationWindowAssignmentScript(dehydrated)
  }
);

// 8. Convert stream to HTML and write to dist/
const html = new Response(prelude, {
  headers: { 'Content-Type': 'text/html; charset=utf-8' }
});
const text = await html.text();
await Bun.write(outputPath, text, { createPath: true });
```

**ALWAYS** use `createStaticHandler` from `react-router` with `lazyRoutes()` (ID: STATIC_HANDLER)

**ALWAYS** create a fresh `QueryClient` instance for each page render (ID: FRESH_QUERY_CLIENT)

**ALWAYS** use `Promise.all()` to prefetch queries concurrently (ID: CONCURRENT_PREFETCH)

**ALWAYS** set `javascriptRuntime: 'server'` in App layers during prerender (ID: SERVER_RUNTIME)

**ALWAYS** pass both `bootstrapModules` and `bootstrapScriptContent` to `prerender()` (ID: BOOTSTRAP_CONFIG)

### Page Configuration Pattern

**ALWAYS** define pages in `scripts/lib/pages.ts` using `StaticPageObject` type (ID: PAGE_OBJECTS)

```typescript
// Example from scripts/lib/pages.ts
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

**ALWAYS** use the same `queryKey` in page configuration and component hooks (ID: CONSISTENT_QUERY_KEYS)

**ALWAYS** include all CSS styles needed for the page in the `styles` array (ID: PAGE_STYLES)

### Dynamic Routes

**ALWAYS** map dynamic route parameters when creating page objects (ID: DYNAMIC_PARAMS)

```typescript
// Example: Dynamic post pages
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

**ALWAYS** use `encodeURIComponent()` for dynamic route parameters (ID: ENCODE_PARAMS)

### Bun Runtime Usage

**ALWAYS** use `Bun.write()` for file operations with `createPath: true` option (ID: BUN_WRITE)

**ALWAYS** leverage Bun's native APIs (File, fetch, etc.) when available (ID: BUN_APIS)

**NEVER** use Node.js-specific APIs incompatible with Bun (ID: NO_NODE_SPECIFIC)

### Error Handling

**ALWAYS** wrap prerender logic in try-catch blocks (ID: ERROR_HANDLING)

**ALWAYS** log detailed errors with route information and stack traces (ID: ERROR_LOGGING)

**ALWAYS** call `queryClient.clear()` after each route to prevent memory leaks (ID: CLEANUP_CLIENT)

### Output Structure

**ALWAYS** write HTML to `dist/` directory with proper routing structure (ID: DIST_OUTPUT)

**ALWAYS** use `getOutputFilePath()` utility to determine correct output path (ID: OUTPUT_PATH_UTIL)

**ALWAYS** create nested directories as needed for routes (ID: NESTED_DIRS)

## Error Handling

If prerendering fails, exit with status code 1 and log metrics showing which pages succeeded/failed. Track duration metrics for each prerender job to identify performance bottlenecks.

## Critical Caveat

The suspenseful pattern using React 19's `use()` API with TanStack Query's experimental `UseQueryResult.promise` requires that **every single useQuery call is prefetched during prerender**. Missing even one query will cause the prerender function to hang indefinitely on an unresolved promise.

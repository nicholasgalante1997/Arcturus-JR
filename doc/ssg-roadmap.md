# Static Site Generation (SSG) Roadmap

## Overview

Transform Arc-Jr from a client-side rendered (CSR) React application into a statically generated site while maintaining full client-side interactivity. This leverages React 19's `prerender` API and TanStack Query's hydration capabilities.

## Architecture Goals

- Pre-render all routes at build time
- Hydrate with prefetched data to eliminate loading states
- Maintain existing component/service architecture
- Zero runtime performance degradation
- Seamless fallback to CSR during development

## Implementation Phases

### Phase 1: Server-Side Services

**Goal**: Create filesystem-based versions of existing services for build-time data access.

**Files to Create**:
- `scripts/ssg/services/Posts.server.ts` - Read from `public/content/posts.json`
- `scripts/ssg/services/Markdown.server.ts` - Read from `public/content/*.md`

**Key Considerations**:
- Use Node.js `fs` module instead of `fetch`
- Match existing service interfaces exactly
- Reuse existing types from `src/services/types.ts`

### Phase 2: Static Path Generation

**Goal**: Generate list of all routes to pre-render.

**Files to Create**:
- `scripts/ssg/paths.ts` - Export `getStaticPaths()` function

**Logic**:
```
Static routes: /, /about, /contact, /posts
Dynamic routes: /post/:id (read from posts.json)
```

### Phase 3: Query Prefetching

**Goal**: Prefetch TanStack Query data for each route.

**Files to Create**:
- `scripts/ssg/prefetch.ts` - Route-specific prefetching logic

**Route Mapping**:
- `/` → prefetch featured posts
- `/posts` → prefetch all posts
- `/post/:id` → prefetch specific post + markdown content
- `/about`, `/contact` → no prefetch needed

**Critical**: Query keys must match exactly with client-side hooks.

### Phase 4: React Prerendering

**Goal**: Render React tree to HTML string with prefetched data.

**Files to Create**:
- `scripts/ssg/render.ts` - Core rendering function

**Implementation**:
1. Create QueryClient and prefetch data
2. Dehydrate query state
3. Wrap app with `StaticRouter` (not `BrowserRouter`)
4. Call React 19's `prerender()` API
5. Collect ReadableStream chunks into HTML string
6. Inject dehydrated state as `window.__REACT_QUERY_STATE__`
7. Read webpack HTML output and inject rendered content

**Challenge**: HTML template uses `<body id="root">` instead of `<div id="root">` - requires careful injection strategy.

### Phase 5: Client-Side Hydration

**Goal**: Hydrate pre-rendered HTML with React and restore query state.

**Files to Modify**:
- `src/main.tsx` - Switch from `createRoot` to `hydrateRoot` when SSG detected
- `src/layout/withProviders.tsx` - Add `HydrationBoundary` with dehydrated state

**Detection Logic**:
```typescript
const dehydratedState = window.__REACT_QUERY_STATE__;
const isSSG = !!dehydratedState;
```

**Hydration Flow**:
1. Check for `window.__REACT_QUERY_STATE__`
2. If present: use `hydrateRoot` + `HydrationBoundary`
3. If absent: use `createRoot` (CSR fallback)

### Phase 6: Build Integration

**Goal**: Orchestrate SSG process and integrate into build pipeline.

**Files to Create**:
- `scripts/ssg/index.ts` - Main orchestration script
- `scripts/ssg.ts` - Entry point

**Build Order**:
1. Webpack bundle → `dist/`
2. PostCSS processing
3. Copy public assets
4. **SSG**: Generate HTML for each path → `dist/`

**Package.json Script**:
```json
{
  "scripts": {
    "ssg": "bun run scripts/ssg.ts",
    "build": "webpack && postcss && copy-assets && bun run ssg"
  }
}
```

### Phase 7: Deployment Optimization

**Goal**: Configure hosting for static files.

**S3/CloudFront Configuration**:
- Set default root object to `index.html`
- Configure error document for SPA routing (404 → index.html)
- Enable gzip/brotli compression
- Set appropriate cache headers

**Alternative**: Consider CloudFront Functions for cleaner routing.

## Technical Decisions

### Why React 19's `prerender`?

- Native SSG support without framework overhead
- Returns ReadableStream for memory efficiency
- Works with existing React Router setup

### Why TanStack Query Hydration?

- Eliminates loading states on initial render
- Seamless data synchronization between server/client
- Built-in stale-while-revalidate support

### Why Parallel Service Implementations?

- Client services use `fetch` (works in browser)
- Server services use `fs` (works in Node.js)
- Keeps concerns separated and testable

## Risks & Mitigations

**Risk**: Query key mismatch between prefetch and client hooks
**Mitigation**: Extract query keys to shared constants

**Risk**: HTML injection breaks with template changes
**Mitigation**: Use robust parsing (cheerio/jsdom) instead of string replacement

**Risk**: Build time increases with content growth
**Mitigation**: Implement incremental static regeneration (ISR) later

**Risk**: Hydration mismatches cause React errors
**Mitigation**: Ensure server/client render identical output; use React DevTools

## Success Metrics

- Zero client-side loading states on initial page load
- Lighthouse Performance score > 95
- Time to Interactive (TTI) < 2s
- Build time < 30s for current content volume
- No hydration errors in console

## Future Enhancements

- Incremental Static Regeneration (ISR) for content updates
- Build-time syntax highlighting for code blocks
- Automatic sitemap generation
- RSS feed generation
- Search index pre-building

## References

- [React 19 prerender API](https://react.dev/reference/react-dom/server/prerender)
- [TanStack Query SSR Guide](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [React Router StaticRouter](https://reactrouter.com/en/main/router-components/static-router)

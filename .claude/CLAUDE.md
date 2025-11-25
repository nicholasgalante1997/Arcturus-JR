# Arc-Jr: Spec-Driven React SSR Development

## Project Overview

Arc-Jr is a sophisticated monorepo for server-side rendered React with static prerendering at build time. The architecture prioritizes performance, developer experience, and architectural consistency through spec-driven development patterns.

**Core Goals:**
- Build-time prerendering with React 19's experimental `prerender` API
- Isomorphic data fetching with TanStack Query
- Type-safe development with strict TypeScript
- Modular Webpack build system with SWC compilation
- Clean component architecture with Container/View separation

## Architecture

### Rendering Strategy

- **Build-time prerendering**: All routes prerendered using React 19's `prerender` API from `react-dom/static.edge`
- **Hydration**: Client hydrates prerendered markup using `hydrateRoot`
- **Data prefetching**: TanStack Query prefetches all data on server during prerender, dehydrates state, rehydrates on client
- **Suspenseful queries**: React 19's `use()` API with TanStack Query's experimental `promise` pattern

### Key Patterns

- **Isomorphic layers**: Data and router layers work identically on server and client
- **Lazy routing**: React Router's lazy loading with code splitting
- **Worker threads**: Web Workers for heavy computation
- **Error boundaries**: Sentry-integrated error handling
- **Pipeline composition**: Functional composition for HOCs

## Development Standards

### TypeScript & React

- **Strict mode**: All implicit any/returns/this disabled
- **Explicit types**: Function parameters and returns always typed
- **Interfaces for objects**: Use interfaces for object shapes
- **Type aliases for unions**: Use type aliases for unions/intersections
- **No `any` type**: Use `unknown` instead
- **Functional components**: Only functional components with hooks
- **React.memo**: Wrap components for optimization
- **Automatic JSX runtime**: React 19's automatic JSX (no React import needed)

### Component Patterns

**File Structure:**
```
ComponentName/
├── index.ts          # Barrel export
├── Component.tsx     # Container with hooks
├── View.tsx          # Presentational
├── types.ts          # TypeScript types
└── __tests__/        # Tests
```

**Container Pattern:**
- Place data fetching and hooks in Container
- Wrap View with `SuspenseEnabledQueryProvider` when using queries
- Use `pipeline` utility for HOC composition

**View Pattern:**
- Use React 19's `use()` API to unwrap query promises
- Keep components pure and presentational
- Wrap with `pipeline(memo)` for optimization

### Build System

**Webpack Configuration:**
- Modular setup: common.mjs, development.mjs, prod.mjs
- SWC loader with thread-loader for parallel compilation
- Code splitting: vendors, runtime, React runtime, route chunks
- Magic comments for lazy-loaded routes with prefetch
- Terser minification with SWC backend
- Source maps for debugging

**Build Order:**
1. Clean previous builds
2. Bundle with Webpack
3. Copy static assets
4. Prerender all routes
5. Process CSS with PostCSS

### Styling

- **Vanilla CSS only**: No CSS-in-JS solutions
- **CSS variables**: Use `@arcjr/void-tokens` for design tokens
- **BEM naming**: Use `void-` prefix for component styles
- **Native link tags**: Include styles using `<link>` elements in page config
- **No CSS imports in TSX**: CSS files in `public/css/`, referenced in page config

### Data Fetching

**TanStack Query Pattern:**
- Create custom hooks returning `UseQueryResult` with server/client branching
- Export both data fetching function and hook
- Use `getJavascriptEnvironment()` to detect server vs client
- Server-side: Return prefetched data wrapped in resolved promise
- Client-side: Return standard `useQuery` result

**Critical Requirement:**
- **ALWAYS prefetch every query used in a route during prerender**
- Missing even one query will cause prerender to hang indefinitely
- Add new queries to `scripts/lib/pages.ts` page configuration

### Prerendering

**Core Pattern:**
1. Create StaticHandler for routes
2. For each page, create fresh QueryClient
3. Prefetch ALL queries concurrently
4. Dehydrate QueryClient state to JSON
5. Create StaticRouter with react-router
6. Render each route to static HTML using `prerender()`
7. Inject dehydrated state and browser bundles into HTML
8. Write HTML files to `dist/` with proper routing structure

**Critical Caveat:**
The suspenseful pattern using React 19's `use()` API with TanStack Query's experimental `UseQueryResult.promise` requires that **every single useQuery call is prefetched during prerender**. Missing even one query will cause the prerender function to hang indefinitely on an unresolved promise.

### Testing

- **Bun test runner**: Native test runner with happy-dom
- **Testing Library**: Use @testing-library/react for component tests
- **Test structure**: Arrange-Act-Assert pattern
- **Test location**: `__tests__/ComponentName.test.tsx` within component folder
- **Test accessibility**: Test aria-*, disabled, and other a11y attributes

### Routing

- **React Router 7**: Lazy loading with code splitting
- **Route constants**: Define paths as constants in `scripts/lib/routes.ts`
- **Dynamic routes**: Use `:param` syntax with `useParams()` hook
- **Page components**: Thin wrappers in `src/pages/` that delegate to feature components
- **Prerender config**: Add all routes to `scripts/lib/pages.ts` with queries and styles

## Technical Decisions

### Why Prerendering?

Static prerendering eliminates client-side data fetching on initial load, providing instant page loads and SEO benefits. The build-time approach trades build time for runtime performance.

### Why Container/View Separation?

Separating data fetching (Container) from presentation (View) enables:
- Pure, testable presentational components
- Reusable Views with different data sources
- Clear separation of concerns
- Easier refactoring and maintenance

### Why Vanilla CSS?

Vanilla CSS with design tokens provides:
- Smaller bundle size (no CSS-in-JS runtime)
- Better performance (no style injection)
- Simpler debugging (standard CSS)
- Team familiarity (no framework learning curve)

### Why Bun Runtime?

Bun provides:
- Native TypeScript execution without compilation
- Fast package management
- Built-in test runner
- Superior performance for build scripts

## Common Operations

> Using Bun

### Development Server
```bash
bun run dev
```
Starts Webpack dev server with HMR at http://localhost:3000

### Production Build
```bash
bun run build
```
Full production build with prerendering

### Serve Production Build
```bash
bun run serve
```
Serves dist/ folder at http://localhost:4200

### Component Development
```bash
bun run storybook
```
Launches Storybook at http://localhost:6006

### Testing
```bash
bun test
```
Runs test suite with Bun test runner

### Linting & Formatting
```bash
bun run lint
bun run fmt
```

### Bundle Analysis
```bash
bun run bundle:analyze
```

> Using Mise

### Development Server
```bash
mise run dev
```

Starts Webpack dev server with HMR at http://localhost:3000

### Production Build
```bash
mise run build
```

Full production build with prerendering

### Serve Production Build
```bash
mise run serve
```

Serves dist/ folder at http://localhost:4200

### Component Development
```bash
mise run storybook
```

Launches Storybook at http://localhost:6006

### Testing

```bash
mise run test
```

Runs test suite with Bun test runner

### Linting & Formatting

```bash
mise run lint
mise run fmt
```

## Monorepo Structure

```
Arc-Jr/
├── apps/
│   └── web/              # Main blog application
├── packages/             # Shared packages
│   ├── void-components/  # React component library
│   ├── void-tokens/      # Design tokens
│   ├── void-css/         # CSS utilities
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configuration
├── turbo.json            # Turborepo pipeline
├── package.json          # Root workspace
└── .claude/              # Claude Code configuration
```

## Tech Stack

- **React 19.1** with SSR and Suspense
- **React Router 7.8** with lazy loading
- **TypeScript** with strict mode
- **Webpack 5** with SWC compilation
- **TanStack Query 5** with SSR support
- **Bun 1.3** runtime and package manager
- **Turborepo 2.6** for monorepo orchestration
- **Sentry** for error tracking
- **GSAP 3** for animations
- **Storybook 9** for component development

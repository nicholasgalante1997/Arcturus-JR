# PROJECT ARCTURUS

> _["Not the Dallas Cowboys, but it's a start."](https://www.reddit.com/r/TheSimpsons/comments/nixdx/project_arcturus_couldnt_have_succeeded_without/)_

[![license](https://img.shields.io/github/license/nicholasgalante1997/Arcturus-JR.svg)](LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

## Table of Contents

- [Background](#background)
- [Monorepo Structure](#monorepo-structure)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Install](#install)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Build System](#build-system)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Background

This was originally an extremely tiny blog microsite powered by vanilla es6, marked, and import maps; hosted on AWS through S3, Cloudfront, Route53, and costing me ultimately under $0.52 monthly. It did not have a bundler. It had maybe 4 dependencies. It was objectively gorgeous, and a flirty love letter to how far modern browsers have come, and how affordable small microsites could be.

It specifically did not leverage React/JSX, a conscious decision that not every web development project needs to be synonymous with React. We all use React every day at work, and that has jaded me to some degree with it. Maybe it's the propensity that enterprise React codebases seem to hurtle themselves with towards unchecked bloat (dependency, bundle output, source code file system). Maybe it's the unending onslaught of junior developers that never learned proper web development fundamentals, but learned React and learned CSS in JS solutions. Maybe it's the mortifying way React has steered it's public identity towards vehement adoption of _frameworks_. You either die a hero, or you live long enough to see yourself become the villain.

In any case, I had committed to not using React here. But then something hit me, and I've had a renewed vigor to challenge my own distaste. React codebases can be beautiful. They can be clean, readable, modular and sustainable. If I'm struck by lightning, you should be able to keep this blog alive without banging your head too hard against a wall. That's the new goal. A scalable, readable React architecture that makes no compromises on performance, developer experience, or simplicity.

If you made it to the end of this diatribe, you deserve something. You won't get anything, but just know you deserve it.

## Monorepo Structure

This project uses **Turborepo** for monorepo management, providing intelligent caching, parallel execution, and optimized build pipelines.

```
Arc-JR/
├── apps/
│   └── web/              # Main blog application
├── packages/             # Shared packages (future)
├── turbo.json            # Turborepo pipeline configuration
├── package.json          # Root workspace configuration
└── .amazonq/             # Amazon Q CLI configuration
```

### Apps

- **web** - Server-side rendered React blog with static prerendering

### Packages

Reserved for future shared libraries and utilities.

## Architecture

This is a **server-side rendered (SSR) React application** with static prerendering at build time. The architecture follows these principles:

### Rendering Strategy

- **Build-time prerendering**: All routes are prerendered using React 19's experimental `prerender` API from `react-dom/static.edge`
- **Hydration**: The client hydrates the prerendered markup using `hydrateRoot` in production
- **Data prefetching**: TanStack Query prefetches all data on the server during prerender, dehydrates state, and rehydrates on the client
- **Suspenseful queries**: Uses React 19's `use` API with TanStack Query's experimental `promise` pattern for suspenseful data fetching

### Key Patterns

- **Isomorphic layers**: Data and router layers work identically on server and client
- **Lazy routing**: All routes use React Router's lazy loading with code splitting
- **Worker threads**: Offloads heavy computation to Web Workers
- **Error boundaries**: Sentry-integrated error handling with React Error Boundaries
- **Pipeline composition**: Functional composition pattern for HOCs and configuration

## Tech Stack

### Monorepo & Build Tools

- **Turborepo 2.6** - High-performance build system for monorepos
- **Bun 1.3** - JavaScript runtime and package manager

### Core

- **React 19.1** - UI/JSX library with SSR and Suspense
- **React Router 7.8** - Client-side routing with SSR support
- **TypeScript** - Type safety and developer experience
- **Bun 1.2** - JavaScript runtime and package manager

### Build & Bundling`

- **Webpack 5** - Module bundler with code splitting
- **SWC** - Fast TypeScript/JavaScript compiler (replaces Babel)
- **Terser** - JavaScript minification with SWC minifier
- **PostCSS** - CSS processing with autoprefixer and cssnano
- **Thread Loader** - Parallel compilation for faster builds

### Data & State

- **TanStack Query 5** - Server state management with SSR support
- **React Query Devtools** - Development debugging tools

### Styling & Content

- **CSS Modules** - Scoped styling
- **PostCSS** - CSS transformations and optimization
- **React Markdown** - Markdown rendering with GitHub Flavored Markdown
- **React Syntax Highlighter** - Code syntax highlighting
- **Highlight.js** - Language detection and highlighting

### Animation

- **GSAP 3** - Professional-grade animation library

### Monitoring & Debugging

- **Sentry** - Error tracking and performance monitoring
- **Debug** - Namespaced logging utility

### Development Tools

- **Storybook 9** - Component development environment
- **ESLint 9** - Linting with flat config
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Lint-staged** - Pre-commit linting
- **Webpack Dev Server** - Hot module replacement

### Testing

- **Bun Test** - Native test runner
- **Testing Library** - React component testing
- **Happy DOM** - Lightweight DOM implementation for tests

### Deployment

- **Docker** - Containerization with multi-stage builds
- **Nginx** - Production web server
- **Serve** - Local static file server

## Install

### Prerequisites

- **Bun** ~1.3.2 (required)
- **Node.js** >=24 (optional, for compatibility)
- **Docker** (optional, for containerized deployment)

### Clone Repository

```bash
git clone git@github.com:nicholasgalante1997/Arcturus-JR.git
cd Arcturus-JR
```

### Install Dependencies

```bash
bun install
```

This installs dependencies for all workspaces in the monorepo.

### Environment Setup

Create a `.env` file in the root directory:

```bash
# Required for Sentry integration
SENTRY_AUTH_TOKEN=your_token_here
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project

# Optional build flags
ARCJR_WEBPACK_OPTIMIZE_SPLIT_CHUNKS=1
ARCJR_WEBPACK_OPTIMIZE_RUNTIME_CHUNK=1
ARCJR_WEBPACK_DEBUG_CONFIG=0
```

## Usage

### Development Server

Start the Webpack dev server with hot module replacement:

```bash
bun run dev
```

Opens at `http://localhost:3000`

### Production Build

Full production build with prerendering:

```bash
bun run build
```

This runs:
1. Clean previous builds
2. Bundle with Webpack
3. Copy static assets (ciphers, workers, markdown, styles)
4. Prerender all routes
5. Process CSS with PostCSS

### Serve Production Build

```bash
bun run serve
```

Serves the `dist/` folder at `http://localhost:4200`

### Component Development

Launch Storybook for isolated component development:

```bash
bun run storybook
```

Opens at `http://localhost:6006`

### Testing

Run the test suite:

```bash
bun test
```

### Linting & Formatting

```bash
# Lint and auto-fix
bun run lint

# Format code
bun run fmt
```

### Bundle Analysis

Analyze bundle size and composition:

```bash
bun run bundle:analyze
```

### Docker Deployment

```bash
# Build image
docker build -t arc-jr ./apps/web

# Run container
docker run -p 8080:80 arc-jr
```

## Project Structure

```
Arc-JR/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── components/       # React components organized by feature
│       │   │   ├── About/
│       │   │   ├── Base/        # Shared/base components
│       │   │   ├── Ciphers/
│       │   │   ├── Contact/
│       │   │   ├── Footer/
│       │   │   ├── Header/
│       │   │   ├── Home/
│       │   │   └── Posts/
│       │   ├── pages/           # Page-level components (thin wrappers)
│       │   ├── routes/          # React Router configuration
│       │   ├── layout/          # Layout components and provider layers
│       │   │   └── layers/
│       │   │       ├── data/    # TanStack Query provider
│       │   │       └── router/  # React Router provider
│       │   ├── services/        # API/data fetching services
│       │   │   ├── Markdown.ts
│       │   │   ├── Posts.ts
│       │   │   └── Cipher/
│       │   ├── hooks/           # Custom React hooks
│       │   ├── utils/           # Utility functions
│       │   ├── workers/         # Web Workers for heavy computation
│       │   ├── animation/       # GSAP animation utilities
│       │   ├── config/          # App configuration (Sentry, etc.)
│       │   ├── types/           # TypeScript type definitions
│       │   ├── models/          # Data models and classes
│       │   ├── App.tsx          # Root App component
│       │   ├── bootstrap.tsx    # Client-side bootstrap logic
│       │   └── main.tsx         # Entry point
│       ├── webpack/
│       │   ├── common.mjs       # Shared Webpack config
│       │   ├── development.mjs  # Dev server config
│       │   ├── prod.mjs         # Production config
│       │   ├── swc/             # SWC compiler options
│       │   ├── html/            # HTML template utilities
│       │   └── utils/           # Webpack utilities
│       ├── scripts/
│       │   ├── prerender.tsx    # SSR prerendering script
│       │   └── lib/             # Prerender utilities
│       ├── public/
│       │   ├── content/         # Markdown content and posts.json
│       │   ├── css/             # Stylesheets and themes
│       │   ├── assets/          # Images and static assets
│       │   └── ciphertexts/     # Encrypted content
│       ├── .cipher/             # Cipher encryption utilities
│       ├── .storybook/          # Storybook configuration
│       ├── dist/                # Production build output
│       ├── Dockerfile           # Multi-stage Docker build
│       ├── nginx.conf           # Nginx configuration
│       └── package.json         # Dependencies and scripts
├── packages/                    # Future shared packages
├── turbo.json                   # Turborepo pipeline configuration
├── package.json                 # Root workspace configuration
└── .amazonq/                    # Amazon Q CLI configuration
```
## Build System

### Turborepo Configuration

Turborepo orchestrates all build tasks with intelligent caching and parallel execution:

- **Pipeline**: Defined in `turbo.json` with task dependencies
- **Caching**: Automatic caching of build outputs for faster rebuilds
- **Parallel Execution**: Runs independent tasks concurrently
- **Remote Caching**: Optional remote cache for team collaboration

### Webpack Configuration

The build system uses a modular Webpack setup:

- **common.mjs**: Shared configuration for all environments
  - SWC loader for TypeScript/JSX compilation
  - Thread loader for parallel processing
  - Path aliases (`@/` → `src/`, `@public/` → `public/`)
  - JSON loader for static data
  - Environment variable injection

- **development.mjs**: Development-specific config
  - Webpack Dev Server with HMR
  - React Refresh for fast refresh
  - Source maps for debugging
  - Static file serving for assets

- **prod.mjs**: Production optimizations
  - Code splitting (vendors, runtime, route chunks)
  - Terser minification with SWC
  - Source map generation
  - Bundle analysis
  - Sentry source map upload

### SWC Compilation

SWC replaces Babel for 20x faster compilation:

- **Target**: ES2023 for modern browsers
- **JSX**: React 19 automatic runtime
- **Optimizations**: Minification, dead code elimination
- **React Refresh**: Fast refresh in development

### Code Splitting Strategy

1. **Vendor chunk**: All node_modules
2. **Runtime chunk**: Webpack runtime
3. **Route chunks**: Lazy-loaded per route
4. **Common chunk**: Shared code between routes

### Prerendering Process

The `scripts/prerender.tsx` script:

1. Creates a QueryClient and prefetches all data for each route
2. Dehydrates the QueryClient state to JSON
3. Creates a StaticRouter with react-router
4. Renders each route to static HTML using `prerender()`
5. Injects dehydrated state and browser bundles into HTML
6. Writes HTML files to `dist/` with proper routing structure

### PostCSS Pipeline

CSS processing with:
- **Autoprefixer**: Browser compatibility
- **Cssnano**: Minification and optimization
- **Source maps**: For debugging

## Development

### Code Patterns

#### Functional Composition

```typescript
// Pipeline utility for composing functions
const enhanced = pipeline(
  withErrorBoundary,
  withSuspense,
  React.memo
)(Component);
```

#### Isomorphic Data Layer

```typescript
// Works identically on server and client
<IsomorphicDataLayer
  javascriptRuntime="browser"
  browser={{ client: queryClient, state: dehydratedState }}
>
  {children}
</IsomorphicDataLayer>
```

#### Lazy Routes

```typescript
// Automatic code splitting per route
{
  path: '/posts',
  lazy: createLazyRouteConfiguration('Posts')
}
```

#### Custom Hooks with React 19 `use()` API

The hooks leverage React 19's `use()` API with TanStack Query's experimental promise support for suspenseful data fetching:

```typescript
// Hook returns UseQueryResult with promise property
export function useGetPosts(): UseQueryResult<Post[], Error> {
  const queryClient = useQueryClient();
  const queryKey = ['posts'];

  // Server-side: return prefetched data from QueryClient
  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey) as Post[];
    return { data, promise: Promise.resolve(data) } as UseQueryResult<Post[], Error>;
  }

  // Client-side: return standard useQuery result (includes promise)
  return useQuery({
    queryKey,
    queryFn: () => getPosts()
  });
}

// Component usage with SuspenseEnabledQueryProvider
function Home() {
  const markdown = useMarkdown('/content/home.md');
  const posts = useGetPosts();
  return (
    <SuspenseEnabledQueryProvider>
      <HomeView queries={[markdown, posts]} />
    </SuspenseEnabledQueryProvider>
  );
}

// View component: unwrap promises with use()
function HomeView({ queries }) {
  const [markdownQuery, postsQuery] = queries;
  const markdown = use(markdownQuery.promise); // Suspends until resolved
  const posts = use(postsQuery.promise);
  return <div>{/* render content */}</div>;
}
```

**Key Pattern Details:**
- Hooks return `UseQueryResult` which includes a `promise` property
- Server-side: Returns prefetched data wrapped in resolved promise
- Client-side: Returns standard `useQuery` result with promise
- `SuspenseEnabledQueryProvider` wraps view components with:
  - `<Suspense>` boundary for loading states
  - `<ErrorBoundary>` for error handling
  - `<QueryErrorResetBoundary>` for query error recovery
- Components use React 19's `use()` to unwrap promises
- Automatic suspense boundary triggering during data fetching
- All queries **must** be prefetched during prerender to avoid hanging

### Debugging

Enable debug logging:

```bash
DEBUG=arc:* bun run dev
```

Namespaces:
- `arc:prerenderer:*` - Prerendering process
- `arc:bootstrap:*` - Client bootstrap
- `arc:services:*` - Data fetching

### Performance Optimization

- **Thread loader**: Parallel TypeScript compilation
- **Code splitting**: Lazy route loading
- **Prerendering**: Zero client-side data fetching on initial load
- **Dehydrated state**: Instant hydration without refetching
- **SWC**: Fast compilation and minification
- **Terser**: Advanced minification with SWC backend

### Browser Support

Targets modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- ES2023 features

## Contributing

See [the contributing file](CONTRIBUTING.md)!

PRs accepted.

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

### Development Workflow

1. Create a feature branch
2. Make changes with tests
3. Run `bun run lint` and `bun run fmt`
4. Commit with descriptive messages
5. Push and open a PR

### Pre-commit Hooks

Husky runs lint-staged on commit:
- Formats `package.json`
- Lints changed files
- Runs type checking

## License

[MIT © Hank Scorpio](./LICENSE)

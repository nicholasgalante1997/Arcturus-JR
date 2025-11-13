# Arc-Jr V2 Migration & Design System Evolution - Complete Architecture

## System Overview

```txt
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            V2 Architecture & Design System                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              Design System Layer                                │    │
│  ├─────────────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                                 │    │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │    │
│  │  │  void-tokens    │───▶│  void-css       │───▶│  void-components│              │    │
│  │  │                 │    │                 │    │                 │              │    │
│  │  │  • CSS Vars     │    │  • Tailwind v4  │    │  • Button       │              │    │
│  │  │  • JS Tokens    │    │  • PostCSS      │    │  • Card         │              │    │
│  │  │  • TS Types     │    │  • Reset/Base   │    │  • Badge        │              │    │
│  │  │  • Style Dict.  │    │  • Utilities    │    │  • Form         │              │    │
│  │  └─────────────────┘    └─────────────────┘    │  • Layout       │              │    │
│  │                                                │  • Navigation   │              │    │
│  │                                                └─────────────────┘              │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                           │                                             │
│                                           ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              Application Layer (apps/web)                       │    │
│  ├─────────────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                                 │    │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │    │
│  │  │  V2 Layout      │───▶│  V2 Components  │───▶│  V2 Pages       │              │    │
│  │  │                 │    │                 │    │                 │              │    │
│  │  │  • AppLayout    │    │  • Header       │    │  • Home         │              │    │
│  │  │  • Document     │    │  • Footer       │    │  • About        │              │    │
│  │  │  • Providers    │    │  • HeroWidget   │    │  • Contact      │              │    │
│  │  └─────────────────┘    │  • PostGrid     │    │  • Posts        │              │    │
│  │                         │  • PostCard     │    │  • Post/:id     │              │    │
│  │                         └─────────────────┘    └─────────────────┘              │    │
│  │                                                                                 │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              Build Pipeline                                     │    │
│  ├─────────────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                                 │    │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │    │
│  │  │  Webpack    │───▶│  PostCSS    │───▶│  Prerender  │───▶│  Static     │       │    │
│  │  │  + SWC      │    │  + Tailwind │    │  + React 19 │    │  HTML/CSS   │       │    │
│  │  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘       │    │
│  │                                                                                 │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Migration Goals

### Primary Objectives

1. **Complete V2 UI Implementation**: Finish all V2 pages with modern design patterns
2. **Tailwind Integration**: Fully integrate Tailwind v4 with PostCSS into the build pipeline
3. **Design System Expansion**: Grow `void-*` packages with reusable, tested components
4. **Seamless Transition**: Migrate from V1 to V2 routes with zero regression

### Design Philosophy

- **Dark-first aesthetic**: Void theme with cosmic/space visual language
- **Performance-focused**: Static prerendering, code splitting, minimal CSS runtime
- **Component-driven**: Container/View separation, reusable primitives
- **Type-safe**: Strict TypeScript, explicit interfaces, no implicit any

## Current State Analysis

### What Exists (V2)

```txt
apps/web/src/
├── components/v2/
│   ├── Header/          ✅ Complete
│   ├── Home/            ✅ Basic (needs refinement)
│   │   └── HeroWidget/  ✅ Complete
│   └── PostGrid/        ✅ Basic
├── layout/v2/
│   └── AppLayout.tsx    ✅ Basic (missing Footer)
└── pages/
    └── v2_Home.tsx      ✅ Wired to /v2 route

packages/
├── void-tokens/         ✅ Complete (Style Dictionary)
├── void-css/            🔄 In Progress (Tailwind setup)
└── void-components/     🔄 In Progress (3 components)
```

### What Needs Work

1. **V2 Pages**: About, Contact, Posts, Post/:id, Ciphers, Cipher/:id
2. **V2 Components**: Footer, Markdown, PostCard (V2), ContactForm (V2)
3. **void-components**: Input, Textarea, Select, Container, Grid, Typography
4. **Build Integration**: Tailwind in apps/web PostCSS pipeline
5. **Route Migration**: Update default routes from V1 → V2

## Technology Stack

### Design System

| Package | Purpose | Status |
|---------|---------|--------|
| `@arcjr/void-tokens` | Design tokens (CSS vars, JS, TS) | ✅ Complete |
| `@arcjr/void-css` | CSS utilities, Tailwind, resets | 🔄 In Progress |
| `@arcjr/void-components` | React component library | 🔄 In Progress |

### Build Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Tailwind CSS | v4.1.18 | Utility-first CSS framework |
| PostCSS | v8.5.6 | CSS transformation pipeline |
| Autoprefixer | v10.4.23 | Browser prefix automation |
| cssnano | v7.1.2 | CSS minification |
| Style Dictionary | v4.0.0 | Design token generation |

### Runtime

| Tool | Version | Purpose |
|------|---------|---------|
| React | v19.1 | UI framework with Suspense/use() |
| React Router | v7.8 | Client/server routing |
| TanStack Query | v5 | Data fetching with SSR |
| Bun | v1.3 | Runtime and package manager |

## Component Architecture

### Container/View Pattern (V2)

```txt
ComponentName/
├── index.ts              # Barrel export
├── Component.tsx         # Container: hooks, data fetching
├── View.tsx              # Presentational: pure render
├── types.ts              # TypeScript interfaces
├── styles.css            # Component-scoped styles (optional)
├── stories/              # Storybook stories
│   └── Component.stories.tsx
└── __tests__/            # Unit tests
    └── Component.test.tsx
```

### Styling Strategy

1. **Design Tokens**: All values from `@arcjr/void-tokens` CSS variables
2. **Tailwind Utilities**: For layout, spacing, responsive design
3. **Component CSS**: BEM-style classes with `void-` prefix for complex components
4. **No CSS-in-JS**: Pure vanilla CSS, no runtime style injection

### Data Flow

```txt
┌─────────────────────────────────────────────────────────────────────┐
│                         Data Flow (V2)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Prerender (Build Time)                                             │
│  ─────────────────────                                              │
│  RouteConfig → StaticPageObject → QueryClient.prefetch()             │
│                                   ↓                                 │
│                            React prerender()                        │
│                                   ↓                                 │
│                         Static HTML + Dehydrated State              │
│                                                                     │
│  Hydration (Runtime)                                                │
│  ───────────────────                                                │
│  HTML + __REACT_QUERY_STATE__ → hydrateRoot()                       │
│                                   ↓                                 │
│                            QueryClient (rehydrated)                 │
│                                   ↓                                 │
│                     Component → useQuery() → use(promise)           │
│                                   ↓                                 │
│                              View renders                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Success Criteria

### Phase Completion Gates

- [ ] **Phase 1**: Tailwind integrated, void-css builds producing minified output
- [ ] **Phase 2**: void-components has 8+ tested components with Storybook
- [ ] **Phase 3**: V2 Layout complete with Header, Footer, responsive design
- [ ] **Phase 4**: All V2 pages implemented, prerendering without hanging
- [ ] **Phase 5**: V2 routes become default, V1 deprecated, full test coverage

### Quality Metrics

- [ ] Lighthouse Performance: ≥90
- [ ] TypeScript: Zero `any` types, strict mode passing
- [ ] Tests: ≥80% coverage on void-components
- [ ] Bundle Size: <200KB initial JS (gzipped)
- [ ] Prerender: All routes complete in <30s total

# Component Composition Pattern Rules

## Purpose
Define standards for creating React components using the project's composition patterns with pipeline utilities, separation of concerns, and proper TypeScript typing.

## Priority
**High**

## Instructions

### Component Structure

**ALWAYS** organize components with this file structure (ID: COMPONENT_STRUCTURE):

```
ComponentName/
├── index.ts          # Exports
├── Component.tsx     # Container with hooks
├── View.tsx          # Presentational component
├── types.ts          # TypeScript types
└── __tests__/        # Tests
    └── ComponentName.test.tsx
```

**ALWAYS** separate container logic from presentation (ID: SEPARATE_CONCERNS)

**ALWAYS** use barrel exports in `index.ts` (ID: BARREL_EXPORTS)

### Container Component Pattern

**ALWAYS** place data fetching and hooks in Container component (ID: CONTAINER_HOOKS)

**ALWAYS** wrap View with `SuspenseEnabledQueryProvider` when using queries (ID: SEQ_WRAPPER)

**ALWAYS** use `pipeline` utility for HOC composition (ID: PIPELINE_HOC)

```typescript
// Component.tsx
import React from 'react';
import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useMarkdown } from '@/hooks/useMarkdown';
import { useGetPosts } from '@/hooks/usePosts';
import { pipeline } from '@/utils/pipeline';
import HomeView from './View';

function Home() {
  const markdown = useMarkdown('/content/home.md');
  const posts = useGetPosts();
  return (
    <SuspenseEnabledQueryProvider>
      <HomeView queries={[markdown, posts]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(React.memo)(Home);
```

### View Component Pattern

**ALWAYS** use React 19's `use()` API to unwrap query promises (ID: USE_API)

**ALWAYS** keep View components pure and presentational (ID: PURE_VIEWS)

**ALWAYS** wrap with `pipeline(memo)` for optimization (ID: MEMO_VIEWS)

```typescript
// View.tsx
import React, { memo, use } from 'react';
import { pipeline } from '@/utils/pipeline';
import { HomeViewProps } from './types';

function HomeView({ queries }: HomeViewProps) {
  const [_markdown, _posts] = queries;
  const markdown = use(_markdown.promise);
  const posts = use(_posts.promise);
  
  return (
    <React.Fragment>
      <div className="markdown-content">
        <Markdown markdown={markdown.markdown} />
      </div>
      <PostCardsList posts={posts} />
    </React.Fragment>
  );
}

export default pipeline(memo)(HomeView) as React.MemoExoticComponent<React.ComponentType<HomeViewProps>>;
```

### Type Definitions

**ALWAYS** define component props in separate `types.ts` file (ID: SEPARATE_TYPES)

**ALWAYS** use proper TypeScript types for query results (ID: TYPE_QUERIES)

```typescript
// types.ts
import { UseQueryResult } from '@tanstack/react-query';
import { MarkdownDocument, Post } from '@/types';

type MarkdownQuery = UseQueryResult<MarkdownDocument>;
type PostsQuery = UseQueryResult<Post[]>;

export interface HomeViewProps {
  queries: [MarkdownQuery, PostsQuery];
}
```

### Pipeline Utility Usage

**ALWAYS** use `pipeline` for composing HOCs and transformations (ID: PIPELINE_COMPOSE)

```typescript
// Single HOC
export default pipeline(React.memo)(Component);

// Multiple HOCs
export default pipeline(
  React.memo,
  withErrorBoundary,
  withSuspense
)(Component);
```

**ALWAYS** apply type assertions when needed for complex types (ID: TYPE_ASSERTIONS)

### Base Components

**ALWAYS** use existing base components when available (ID: USE_BASE_COMPONENTS):
- `SuspenseEnabledQueryProvider` - Wraps queries with Suspense and ErrorBoundary
- `Markdown` - Renders markdown content
- `Loader` - Loading spinner
- `ErrorBoundary` - Error handling

**NEVER** recreate functionality that exists in base components (ID: NO_DUPLICATE_BASE)

### Component Naming

**ALWAYS** use PascalCase for component names (ID: PASCAL_CASE)

**ALWAYS** name View components with `View` suffix (ID: VIEW_SUFFIX)

**ALWAYS** name Container components without suffix (ID: NO_CONTAINER_SUFFIX)

### CSS and Styling

**NEVER** import CSS directly into TypeScript files (ID: NO_CSS_IMPORTS)

**NEVER** use CSS Modules (ID: NO_CSS_MODULES)

**ALWAYS** place CSS files in `public/css/` directory (ID: CSS_IN_PUBLIC)

**ALWAYS** include styles using native HTML `<link>` elements with preloading (ID: NATIVE_LINK_TAGS)

**ALWAYS** define styles in page configuration in `scripts/lib/pages.ts` (ID: STYLES_IN_PAGE_CONFIG)

```typescript
// scripts/lib/pages.ts
{
  path: NON_DYNAMIC_ROUTES.POSTS,
  queries: [...],
  styles: [...BASE_CSS_STYLES, '/css/post.min.css']
}
```

**ALWAYS** rely on React DOM's automatic hoisting of `<link>` elements to `<head>` (ID: LINK_HOISTING)

### React Fragments

**ALWAYS** use `React.Fragment` for multiple root elements (ID: FRAGMENTS)

**NEVER** add unnecessary wrapper divs (ID: NO_WRAPPER_DIVS)

## Error Handling

Components wrapped with `SuspenseEnabledQueryProvider` automatically handle loading and error states. No manual error handling needed in component code.

## Examples

### Complete Component Example

```typescript
// index.ts
export { default as About } from './Component';

// Component.tsx
import React from 'react';
import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useMarkdown } from '@/hooks/useMarkdown';
import { pipeline } from '@/utils/pipeline';
import AboutView from './View';

function About() {
  const markdown = useMarkdown('/content/about.md');
  return (
    <SuspenseEnabledQueryProvider>
      <AboutView queries={[markdown]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(React.memo)(About);

// View.tsx
import React, { memo, use } from 'react';
import { Markdown } from '@/components/Base/Markdown';
import { pipeline } from '@/utils/pipeline';
import { AboutViewProps } from './types';

function AboutView({ queries }: AboutViewProps) {
  const [_markdown] = queries;
  const markdown = use(_markdown.promise);
  
  return (
    <div className="markdown-content">
      <Markdown markdown={markdown.markdown} />
    </div>
  );
}

export default pipeline(memo)(AboutView) as React.MemoExoticComponent<React.ComponentType<AboutViewProps>>;

// types.ts
import { UseQueryResult } from '@tanstack/react-query';
import { MarkdownDocument } from '@/types';

type MarkdownQuery = UseQueryResult<MarkdownDocument>;

export interface AboutViewProps {
  queries: [MarkdownQuery];
}
```

### Component Without Queries

```typescript
// Component.tsx
import React from 'react';
import { pipeline } from '@/utils/pipeline';
import ContactView from './View';

function Contact() {
  return <ContactView />;
}

export default pipeline(React.memo)(Contact);

// View.tsx
import React, { memo } from 'react';
import { pipeline } from '@/utils/pipeline';

function ContactView() {
  return (
    <div>
      <h1>Contact</h1>
      <form>{/* form fields */}</form>
    </div>
  );
}

export default pipeline(memo)(ContactView);
```

---
name: component-composition
description: Component composition patterns including Container/View separation, pipeline HOC composition, and proper TypeScript typing for React components.
tags:
  - components
  - composition
  - typescript
  - patterns
---

# Component Composition Skill

## Overview

This skill covers Arc-Jr's component composition patterns, emphasizing Container/View separation, functional composition with the pipeline utility, and proper TypeScript typing.

### Purpose

Define standards for creating React components using the project's composition patterns with pipeline utilities, separation of concerns, and proper TypeScript typing.

### Priority

**High**

## High Level Overview

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

## File Structure

All components follow this structure:

```
ComponentName/
├── index.ts              # Barrel export
├── Component.tsx         # Container with hooks
├── View.tsx             # Presentational component
├── types.ts             # TypeScript types
└── __tests__/           # Tests
    └── ComponentName.test.tsx
```

### index.ts - Barrel Export

```typescript
export { default as ComponentName } from './Component';
export type { ComponentNameProps } from './types';
```

### types.ts - Type Definitions

```typescript
import { UseQueryResult } from '@tanstack/react-query';

export interface ComponentNameProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
}

// For components with queries
type PostQuery = UseQueryResult<Post>;

export interface ComponentNameViewProps {
  queries: [PostQuery];
}
```

## Container Component Pattern

Container components handle data fetching and hooks:

```typescript
// Component.tsx
import React from 'react';
import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useGetPosts } from '@/hooks/usePosts';
import { pipeline } from '@/utils/pipeline';
import ComponentNameView from './View';
import type { ComponentNameProps } from './types';

/**
 * ComponentName container component
 * 
 * Handles data fetching and state management.
 * Wraps view with SuspenseEnabledQueryProvider for query handling.
 */
function ComponentName(props: ComponentNameProps) {
  const posts = useGetPosts();
  
  return (
    <SuspenseEnabledQueryProvider>
      <ComponentNameView queries={[posts]} {...props} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(React.memo)(ComponentName);
```

### Key Patterns

- **Place all hooks in Container** - data fetching, state, effects
- **Wrap View with SuspenseEnabledQueryProvider** - handles Suspense and errors
- **Use pipeline for HOC composition** - cleaner than nested HOCs
- **Export as default** - enables lazy loading

## View Component Pattern

View components are pure and presentational:

```typescript
// View.tsx
import React, { memo, use } from 'react';
import { pipeline } from '@/utils/pipeline';
import type { ComponentNameViewProps } from './types';

/**
 * ComponentName view component
 * 
 * Pure presentational component. Uses React 19's use() API
 * to unwrap query promises from Container.
 */
function ComponentNameView({ queries, title }: ComponentNameViewProps) {
  const [_posts] = queries;
  const posts = use(_posts.promise);
  
  return (
    <div className="component-name">
      <h1>{title}</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default pipeline(memo)(ComponentNameView) as React.MemoExoticComponent<
  React.ComponentType<ComponentNameViewProps>
>;
```

### Key Patterns

- **Use React 19's use() API** - unwrap promises for Suspense
- **Keep components pure** - no side effects
- **Wrap with pipeline(memo)** - optimize expensive components
- **Type assertions for complex types** - helps TypeScript understand memo wrapping
- **No data fetching** - all data comes from Container

## Pipeline Utility

The pipeline utility composes HOCs functionally:

```typescript
import { pipeline } from '@/utils/pipeline';

// Single HOC
export default pipeline(React.memo)(Component);

// Multiple HOCs
export default pipeline(
  React.memo,
  withErrorBoundary,
  withSuspense
)(Component);

// With type assertion
export default pipeline(memo)(Component) as React.MemoExoticComponent<
  React.ComponentType<Props>
>;
```

### Implementation

```typescript
// utils/pipeline.ts
export function pipeline<T>(
  ...fns: Array<(arg: T) => T>
): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}
```

## Component Without Queries

For components that don't fetch data:

```typescript
// Component.tsx
import React from 'react';
import { pipeline } from '@/utils/pipeline';
import ButtonView from './View';
import type { ButtonProps } from './types';

function Button(props: ButtonProps) {
  return <ButtonView {...props} />;
}

export default pipeline(React.memo)(Button);

// View.tsx
import React, { memo } from 'react';
import { pipeline } from '@/utils/pipeline';
import type { ButtonProps } from './types';

function ButtonView({ label, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

export default pipeline(memo)(ButtonView);
```

## Styling Components

Never import CSS in TypeScript files:

```typescript
// Bad - don't do this
import './Component.css';

function Component() {
  return <div>Hello</div>;
}

// Good - CSS in public/css/, referenced in page config
function Component() {
  return <div className="component">Hello</div>;
}
```

For Storybook stories, import CSS in the story file:

```typescript
// Component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './index';
import './Component.css'; // Import CSS in story only

const meta: Meta<typeof Component> = {
  title: 'Components/Component',
  component: Component
};
```

## TypeScript Patterns

### Explicit Types

Always type function parameters and returns:

```typescript
// Good
function fetchPost(id: string): Promise<Post> {
  return api.getPost(id);
}

// Bad
function fetchPost(id) {
  return api.getPost(id);
}
```

### Interfaces for Objects

Use interfaces for object shapes:

```typescript
interface ComponentProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
}

function Component(props: ComponentProps) {
  return <button disabled={props.disabled}>{props.title}</button>;
}
```

### Type Aliases for Unions

Use type aliases for unions and intersections:

```typescript
type Status = 'loading' | 'success' | 'error';
type QueryResult<T> = UseQueryResult<T> & { status: Status };
```

## Testing Components

Test View components directly:

```typescript
import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import ComponentNameView from '../View';

describe('ComponentNameView', () => {
  test('renders title', () => {
    const { getByText } = render(
      <ComponentNameView title="Test" />
    );
    expect(getByText('Test')).toBeInTheDocument();
  });
});
```

## Error Handling

Components wrapped with `SuspenseEnabledQueryProvider` automatically handle loading and error states. No manual error handling needed in component code.

## Best Practices

1. **Separate concerns** - Container handles data, View handles presentation
2. **Use pipeline** - cleaner HOC composition than nesting
3. **Type everything** - no implicit any
4. **Keep Views pure** - no side effects or hooks
5. **Use React.memo** - optimize expensive components
6. **Test Views** - test presentation logic directly
7. **Document with JSDoc** - explain component purpose
8. **Co-locate files** - keep related files together

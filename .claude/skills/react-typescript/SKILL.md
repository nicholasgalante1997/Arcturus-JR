---
name: react-typescript
description: React 19 patterns with typescript.
tags:
  - react
  - typescript
---
# TypeScript and React Code Standards

## Purpose

Define coding standards for TypeScript and React development following the project's configuration and best practices.

## Priority

**High**

## Instructions

### TypeScript Configuration

**ALWAYS** use strict TypeScript settings (ID: STRICT_TS)

**ALWAYS** enable `noImplicitAny`, `noImplicitReturns`, `noImplicitThis` (ID: NO_IMPLICIT)

**ALWAYS** enable `noUnusedLocals` and `noUnusedParameters` (ID: NO_UNUSED)

**ALWAYS** enable `noUncheckedIndexedAccess` for safer array/object access (ID: CHECKED_INDEX)

**ALWAYS** use path aliases `@/*` for src and `@public/*` for public (ID: PATH_ALIASES)

### TypeScript Best Practices

**ALWAYS** explicitly type function parameters and return types (ID: EXPLICIT_TYPES)

```typescript
// Good
function fetchPost(id: string): Promise<Post> {
  return new PostsService().fetchPost(id);
}

// Bad
function fetchPost(id) {
  return new PostsService().fetchPost(id);
}
```

**ALWAYS** use interfaces for object shapes (ID: USE_INTERFACES)

**ALWAYS** use type aliases for unions, intersections, and utility types (ID: USE_TYPE_ALIASES)

```typescript
// Interfaces for object shapes
interface Post {
  id: string;
  title: string;
  content: string;
}

// Type aliases for unions/utilities
type PostStatus = 'draft' | 'published' | 'archived';
type PartialPost = Partial<Post>;
```

**ALWAYS** use `const` assertions for literal types (ID: CONST_ASSERTIONS)

```typescript
export const ROUTES = {
  HOME: '/',
  POSTS: '/posts'
} as const;
```

**NEVER** use `any` type - use `unknown` instead (ID: NO_ANY)

**ALWAYS** handle null/undefined explicitly (ID: HANDLE_NULLISH)

### React Best Practices

**ALWAYS** use functional components with hooks (ID: FUNCTIONAL_COMPONENTS)

**NEVER** use class components (ID: NO_CLASS_COMPONENTS)

**ALWAYS** use React 19's automatic JSX runtime (ID: AUTO_JSX)

**ALWAYS** wrap components with `React.memo` for optimization (ID: MEMO_COMPONENTS)

```typescript
import React from 'react';

function Component({ prop }: Props) {
  return <div>{prop}</div>;
}

export default React.memo(Component);
```

**ALWAYS** use `React.Fragment` or `<>` for multiple root elements (ID: USE_FRAGMENTS)

**NEVER** use unnecessary wrapper divs (ID: NO_WRAPPER_DIVS)

### Import Organization

**ALWAYS** organize imports in this order (ID: IMPORT_ORDER):

1. Side effect imports
2. Node.js builtins
3. External packages (React, libraries)
4. Internal packages (`@/`, `~/`)
5. Parent imports (`../`)
6. Same-folder imports (`./`)
7. Type imports

```typescript
import 'dotenv/config';

import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { Post } from '@/types/Post';
import { pipeline } from '@/utils/pipeline';

import { HomeViewProps } from './types';
```

**ALWAYS** use ESLint's `simple-import-sort` plugin (ID: SORT_IMPORTS)

### Naming Conventions

**ALWAYS** use PascalCase for components, interfaces, types, classes (ID: PASCAL_CASE)

**ALWAYS** use camelCase for variables, functions, methods (ID: CAMEL_CASE)

**ALWAYS** use SCREAMING_SNAKE_CASE for constants (ID: SNAKE_CASE_CONSTANTS)

```typescript
// Components
const HomePage = () => <div>Home</div>;

// Interfaces/Types
interface UserProfile {}
type PostStatus = 'draft' | 'published';

// Variables/Functions
const userName = 'John';
function fetchUserData() {}

// Constants
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';
```

### File Organization

**ALWAYS** use barrel exports (`index.ts`) for public API (ID: BARREL_EXPORTS)

**ALWAYS** co-locate related files (component, types, tests) (ID: COLOCATE_FILES)

**ALWAYS** use `.tsx` for files with JSX, `.ts` for pure TypeScript (ID: FILE_EXTENSIONS)

### Error Handling

**ALWAYS** use custom Error classes for domain errors (ID: CUSTOM_ERRORS)

**ALWAYS** throw descriptive errors with context (ID: DESCRIPTIVE_ERRORS)

```typescript
class PostNotFoundError extends Error {
  constructor(postId: string) {
    super(`Post with ID ${postId} not found`);
    this.name = 'PostNotFoundError';
  }
}
```

**ALWAYS** handle errors at appropriate boundaries (ID: ERROR_BOUNDARIES)

### Async/Await

**ALWAYS** use async/await over raw Promises (ID: USE_ASYNC_AWAIT)

**ALWAYS** handle errors in async functions (ID: HANDLE_ASYNC_ERRORS)

```typescript
async function fetchPost(id: string): Promise<Post> {
  try {
    const response = await fetch(`/api/posts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return await response.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}
```

### React Hooks Rules

**ALWAYS** call hooks at the top level (ID: HOOKS_TOP_LEVEL)

**NEVER** call hooks conditionally (ID: NO_CONDITIONAL_HOOKS)

**ALWAYS** use dependency arrays correctly in useEffect/useMemo/useCallback (ID: HOOK_DEPS)

**ALWAYS** prefix custom hooks with `use` (ID: HOOK_PREFIX)

```typescript
// Good
function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id)
  });
}

// Bad
function getPost(id: string) {
  return useQuery({ ... }); // Missing 'use' prefix
}
```

### Comments and Documentation

**ALWAYS** use JSDoc for public APIs and complex functions (ID: JSDOC)

**ALWAYS** explain "why" not "what" in comments (ID: WHY_NOT_WHAT)

**NEVER** leave commented-out code (ID: NO_COMMENTED_CODE)

```typescript
/**
 * Fetches a post by ID with retry logic
 * @param id - The post identifier
 * @returns Promise resolving to Post object
 * @throws PostNotFoundError if post doesn't exist
 */
async function fetchPost(id: string): Promise<Post> {
  // Retry logic needed due to intermittent API failures
  return retryWithBackoff(() => api.getPost(id));
}
```

### Performance Considerations

**ALWAYS** use `React.memo` for expensive components (ID: MEMO_EXPENSIVE)

**ALWAYS** use `useMemo` for expensive computations (ID: USE_MEMO)

**ALWAYS** use `useCallback` for functions passed to memoized children (ID: USE_CALLBACK)

**NEVER** create objects/arrays inline in JSX props (ID: NO_INLINE_OBJECTS)

```typescript
// Good
const config = useMemo(() => ({ theme: 'dark' }), []);
return <Component config={config} />;

// Bad
return <Component config={{ theme: 'dark' }} />;
```

## Error Handling

Follow TypeScript's strict mode requirements. All type errors must be resolved before committing code.

## Examples

### Complete TypeScript Component

```typescript
import React, { memo } from 'react';

import { pipeline } from '@/utils/pipeline';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

export default pipeline(memo)(Button);
```

### Service Class Pattern

```typescript
import { Post } from '@/types/Post';

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

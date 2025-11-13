# Void Component Library

Reference documentation for the `@arcjr/void-components` package.

## Overview

Void Components is a React component library built on the Void Design System, providing:

- **Pre-built components** with consistent styling
- **Vanilla CSS** with design token integration
- **TypeScript support** with full type safety
- **Accessibility** (WCAG 2.1 AA compliant)
- **Storybook** documentation and testing

## Component Architecture

### Structure Pattern

Every component follows this structure:

```
ComponentName/
├── index.ts                    # Barrel export
├── Component.tsx               # Container with logic
├── View.tsx                    # Presentational component
├── types.ts                    # TypeScript interfaces
├── ComponentName.css           # Vanilla CSS styles
├── ComponentName.stories.tsx   # Storybook stories
└── __tests__/
    └── ComponentName.test.tsx  # Unit tests
```

### Component Layers

#### 1. Types Layer (`types.ts`)

```typescript
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}
```

#### 2. View Layer (`View.tsx`)

```typescript
import { memo } from 'react';
import clsx from 'clsx';
import { pipeline } from '@/utils/pipeline';
import type { ButtonProps } from './types';

function ButtonView({ 
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...rest 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'void-button',
        `void-button--${variant}`,
        `void-button--${size}`,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default pipeline(memo)(ButtonView);
```

#### 3. Container Layer (`Component.tsx`)

```typescript
import { pipeline } from '@/utils/pipeline';
import ButtonView from './View';
import type { ButtonProps } from './types';

/**
 * Button component for primary user actions
 * 
 * @example
 * <Button variant="primary">Save</Button>
 */
function Button(props: ButtonProps) {
  return <ButtonView {...props} />;
}

export default pipeline(memo)(Button);
```

#### 4. Style Layer (`ComponentName.css`)

```css
.void-button {
  display: inline-flex;
  align-items: center;
  padding: var(--void-spacing-3) var(--void-spacing-6);
  background: var(--void-color-brand-primary);
  color: var(--void-color-base-white);
  border: none;
  border-radius: var(--void-radius-md);
  font-family: var(--void-font-family-sans);
  transition: all var(--void-transition-fast);
}

.void-button--primary {
  background: var(--void-color-brand-primary);
}

.void-button--secondary {
  background: var(--void-color-gray-600);
}

.void-button--sm {
  padding: var(--void-spacing-2) var(--void-spacing-4);
}

.void-button--lg {
  padding: var(--void-spacing-4) var(--void-spacing-8);
}
```

## Component Catalog

### Button

**Purpose**: Primary user actions

**Variants**: `primary`, `secondary`, `tertiary`
**Sizes**: `sm`, `md`, `lg`

**Usage**:
```tsx
import { Button } from '@arcjr/void-components';

<Button variant="primary" onClick={handleSave}>Save</Button>
```

### Card

**Purpose**: Content containers with elevation

**Usage**:
```tsx
import { Card } from '@arcjr/void-components';

<Card>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

### Input

**Purpose**: Text input fields

**Usage**:
```tsx
import { Input } from '@arcjr/void-components';

<Input
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

## Creating New Components

### Quick Start

1. Create directory structure
2. Define types
3. Create View component
4. Create Container component
5. Create styles with Void tokens
6. Create Storybook stories
7. Write tests
8. Export from package index

See [WORKFLOWS.md](./WORKFLOWS.md#creating-a-new-component) for detailed steps.

## Best Practices

### Component Design

✓ **DO**:
- Extend native HTML props
- Use Void design tokens exclusively
- Follow BEM naming with `void-` prefix
- Document with JSDoc
- Write comprehensive tests

✗ **DON'T**:
- Import CSS in `.tsx` files (except `.stories.tsx`)
- Hardcode values
- Use generic class names
- Skip accessibility attributes

### Styling

✓ **DO**:
```css
.void-component {
  padding: var(--void-spacing-4);
  background: var(--void-color-base-white);
}
```

✗ **DON'T**:
```css
.component {
  padding: 16px;
  background: #ffffff;
}
```

## Resources

- [Component Workflows](./WORKFLOWS.md#creating-a-new-component)
- [Design Tokens](./TOKENS.md)
- [Build System](./BUILD-SYSTEM.md)

---

See [README.md](./README.md) for complete documentation.

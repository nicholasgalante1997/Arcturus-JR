# Void Design System - Complete Guide

> A comprehensive CSS design system for Arc-Jr built on design tokens, utility CSS, and component libraries

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Package Ecosystem](#package-ecosystem)
4. [Build Pipeline](#build-pipeline)
5. [Usage Guide](#usage-guide)
6. [Best Practices](#best-practices)
7. [Development Workflow](#development-workflow)

## Overview

The Void Design System is a modular, token-based CSS architecture that provides:

- **Design Tokens**: CSS variables for colors, spacing, typography, and more
- **Component Styles**: Pre-built component CSS with BEM naming conventions
- **Utility CSS**: Tailwind CSS integration for rapid development
- **PostCSS Pipeline**: Modern CSS processing with autoprefixing and minification
- **Type Safety**: TypeScript definitions for all design tokens

### Design Philosophy

1. **Vanilla CSS First**: No CSS-in-JS. All styles are standard CSS files
2. **Token-Driven**: All design decisions stem from centralized design tokens
3. **Build-Time Processing**: CSS is processed, optimized, and tree-shaken at build time
4. **Progressive Enhancement**: Base styles with optional utility classes
5. **Component Isolation**: Each component owns its styles, no global pollution

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Void Design System                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                     │
│  │ void-tokens  │──────│  void-css    │                     │
│  │              │      │              │                     │
│  │ - colors.ts  │      │ - reset.css  │                     │
│  │ - spacing.ts │      │ - tailwind   │                     │
│  │ - typography │      │ - utilities  │                     │
│  └──────┬───────┘      └──────┬───────┘                     │
│         │                     │                              │
│         └──────────┬──────────┘                              │
│                    │                                         │
│         ┌──────────▼──────────┐                              │
│         │  void-components    │                              │
│         │                     │                              │
│         │  - Button.css       │                              │
│         │  - Card.css         │                              │
│         │  - Input.css        │                              │
│         └──────────┬──────────┘                              │
│                    │                                         │
│         ┌──────────▼──────────┐                              │
│         │   postcss-utils     │                              │
│         │                     │                              │
│         │  - autoprefixer     │                              │
│         │  - cssnano          │                              │
│         │  - tailwind         │                              │
│         └──────────┬──────────┘                              │
│                    │                                         │
└────────────────────┼─────────────────────────────────────────┘
                     │
         ┌───────────▼───────────┐
         │      apps/web         │
         │                       │
         │  Consumes:            │
         │  - Design tokens      │
         │  - Component styles   │
         │  - Utility classes    │
         │  - Custom CSS         │
         └───────────────────────┘
```

## Package Ecosystem

### 1. @arcjr/void-tokens

**Purpose**: Centralized design token definitions with CSS variable generation

**Location**: `packages/void-tokens/`

**Token Categories**:
- **Colors**: Brand, semantic, base, gray scale
- **Spacing**: 0-12 scale based on 4px increments
- **Typography**: Font families, sizes, weights, line heights
- **Borders**: Radius and width values
- **Transitions**: Duration and easing functions
- **Shadows**: Elevation shadows
- **Z-index**: Stacking order values

**Usage**:
```typescript
// Import TypeScript tokens
import { colors, spacing, typography } from '@arcjr/void-tokens';

// Use in JavaScript
const primaryColor = colors.brand.primary;
const spacing4 = spacing[4];
```

```css
/* Use CSS variables */
.component {
  color: var(--void-color-brand-primary);
  padding: var(--void-spacing-4);
  font-family: var(--void-font-family-sans);
}
```

```jsx
// Use with Tailwind
<div className="bg-brand-primary p-4 font-sans" />
```

### 2. @arcjr/void-css

**Purpose**: Base CSS reset, Tailwind configuration, and utility CSS

**Location**: `packages/void-css/`

**Key Files**:
- `css/void-reset.css` - Modern CSS reset with sensible defaults
- `tailwind.config.js` - Tailwind configuration with Void tokens
- `postcss.config.js` - PostCSS configuration for processing

**CSS Reset Features**:
- Box-sizing: border-box
- Font smoothing and rendering
- Responsive image defaults
- Form element normalization
- Focus-visible styles
- Sensible typography defaults

**Tailwind Integration**:
```javascript
// Automatically maps Void tokens to Tailwind utilities
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--void-color-brand-primary)',
          secondary: 'var(--void-color-brand-secondary)',
        }
      },
      spacing: {
        1: 'var(--void-spacing-1)',
        2: 'var(--void-spacing-2)',
        // ... all Void spacing tokens
      }
    }
  }
};
```

### 3. @arcjr/void-components

**Purpose**: React component library with isolated CSS styles

**Location**: `packages/void-components/`

**Component Structure** (every component follows this):
```
ComponentName/
├── index.ts              # Barrel export
├── Component.tsx         # Container with JSDoc
├── View.tsx             # Presentational component
├── types.ts             # TypeScript interfaces
├── ComponentName.css    # Vanilla CSS with Void tokens
├── ComponentName.stories.tsx  # Storybook stories
└── __tests__/
    └── ComponentName.test.tsx  # Unit tests
```

**Component Pattern**:

**Types** - Define component API:
```typescript
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}
```

**View** - Pure presentation:
```typescript
import { memo } from 'react';
import clsx from 'clsx';
import { pipeline } from '@/utils/pipeline';

function ButtonView({ variant = 'primary', children, className, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx('void-button', `void-button--${variant}`, className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export default pipeline(memo)(ButtonView);
```

**Container** - Logic and documentation:
```typescript
/**
 * Button component for user actions
 *
 * @example
 * <Button variant="primary">Save</Button>
 */
function Button(props: ButtonProps) {
  return <ButtonView {...props} />;
}

export default pipeline(memo)(Button);
```

**Styles** - Vanilla CSS with tokens:
```css
.void-button {
  padding: var(--void-spacing-3) var(--void-spacing-6);
  background: var(--void-color-brand-primary);
  color: var(--void-color-base-white);
  border-radius: var(--void-radius-md);
  transition: all var(--void-transition-fast);
}

.void-button--primary { /* variant styles */ }
.void-button--secondary { /* variant styles */ }
```

### 4. @arcjr/postcss-utils

**Purpose**: Shared PostCSS configuration and CLI utilities

**Location**: `packages/postcss-utils/`

**CLI Usage**:
```bash
# Process single file
postcss-utils input.css -o output.css

# Process with Tailwind
postcss-utils input.css -o output.css --tailwind

# Watch mode
postcss-utils src/**/*.css -o dist/ --watch
```

## Build Pipeline

### Overview

```
Stage 1: void-tokens
  ├─ Compile TypeScript → JavaScript
  ├─ Generate CSS variables from tokens
  └─ Output: dist/tokens.css, dist/index.js

Stage 2: void-css
  ├─ Process void-reset.css through PostCSS
  ├─ Configure Tailwind with Void tokens
  └─ Output: dist/void-reset.css

Stage 3: void-components
  ├─ Bundle components with esbuild.build()
  ├─ Process component CSS through PostCSS
  ├─ Generate TypeScript declarations
  └─ Output: dist/*.js, dist/css/*.css, dist/*.d.ts

Stage 4: apps/web
  ├─ Bundle application with Webpack + SWC
  ├─ Process application CSS
  ├─ Prerender routes with React 19
  └─ Output: dist/*, static HTML files
```

### CSS Loading Strategy

```html
<link rel="stylesheet" href="/css/tokens.css">        <!-- 1. Tokens first -->
<link rel="stylesheet" href="/css/void-reset.css">    <!-- 2. Reset second -->
<link rel="stylesheet" href="/css/Button.css">        <!-- 3. Components third -->
<link rel="stylesheet" href="/css/app.css">           <!-- 4. App styles last -->
```

## Usage Guide

### Using Design Tokens

**In CSS Files**:
```css
.my-component {
  /* Colors */
  color: var(--void-color-brand-primary);
  background: var(--void-color-base-white);

  /* Spacing */
  padding: var(--void-spacing-4);
  margin: var(--void-spacing-2) 0;
  gap: var(--void-spacing-3);

  /* Typography */
  font-family: var(--void-font-family-sans);
  font-size: var(--void-font-size-md);
  line-height: var(--void-line-height-normal);

  /* Borders */
  border-radius: var(--void-radius-md);
  border-width: var(--void-border-width-sm);

  /* Effects */
  box-shadow: var(--void-shadow-md);
  transition: all var(--void-transition-fast);
}
```

**In TypeScript**:
```typescript
import { colors, spacing, typography } from '@arcjr/void-tokens';

// Use in inline styles
const style = {
  color: colors.brand.primary,
  padding: `${spacing[4]} ${spacing[6]}`,
  fontFamily: typography.fontFamily.sans,
};
```

**With Tailwind**:
```jsx
// Tailwind utilities automatically use Void tokens
<div className="bg-brand-primary text-base-white p-4 rounded-md shadow-md">
  <h2 className="text-2xl font-bold mb-2">Title</h2>
  <p className="text-gray-600">Content</p>
</div>
```

### Creating Custom Components

```css
/* CustomButton.css */
.custom-button {
  display: inline-flex;
  align-items: center;
  gap: var(--void-spacing-2);
  padding: var(--void-spacing-3) var(--void-spacing-6);
  background: var(--void-color-brand-primary);
  color: var(--void-color-base-white);
  border: none;
  border-radius: var(--void-radius-md);
  font-family: var(--void-font-family-sans);
  font-size: var(--void-font-size-md);
  cursor: pointer;
  transition: all var(--void-transition-fast);
}

.custom-button:hover {
  background: var(--void-color-brand-secondary);
  box-shadow: var(--void-shadow-md);
}
```

```typescript
// CustomButton.tsx
import './CustomButton.css';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function CustomButton({ children, onClick }: CustomButtonProps) {
  return (
    <button className="custom-button" onClick={onClick}>
      {children}
    </button>
  );
}
```

## Best Practices

### DO ✓

```css
/* Always use design tokens */
.component {
  color: var(--void-color-brand-primary);
  padding: var(--void-spacing-4);
  font-family: var(--void-font-family-sans);
}
```

```css
/* Use BEM with void- prefix */
.void-button { }
.void-button--primary { }
.void-button__icon { }
```

```typescript
// Import only what you need (tree-shakeable)
import { Button, Card } from '@arcjr/void-components';
```

### DON'T ✗

```css
/* Avoid hardcoded values */
.component {
  color: #007AFF;
  padding: 16px;
}
```

```css
/* Avoid generic names */
.button { }
.primary { }
```

```typescript
// Don't import everything
import * as Void from '@arcjr/void-components';
```

## Development Workflow

### Adding a New Design Token

1. Define in TypeScript (`packages/void-tokens/src/tokens/colors.ts`)
2. Build tokens: `cd packages/void-tokens && bun run build`
3. Verify CSS output: `cat dist/tokens.css | grep "tertiary"`
4. Update Tailwind config if using Tailwind
5. Use in components

### Creating a New Component

1. Create structure in `packages/void-components/src/ComponentName/`
2. Define types, View, Container, styles
3. Create Storybook stories
4. Write tests
5. Export from package index
6. Build: `bun run build`
7. Test in Storybook: `bun run storybook`

See [WORKFLOWS.md](./WORKFLOWS.md) for detailed step-by-step guides.

## Performance Optimization

### Tree Shaking

Enable in all packages:
```json
// package.json
{
  "sideEffects": false
}
```

### Code Splitting

```typescript
// Automatic with React Router lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### CSS Purging

```javascript
// Tailwind automatically purges unused utilities
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
};
```

## Resources

- [Design Tokens Reference](./TOKENS.md)
- [Component Library Guide](./COMPONENTS.md)
- [Build System Deep Dive](./BUILD-SYSTEM.md)
- [Migration Guide](./MIGRATION.md)
- [Quick Reference](./QUICK-REFERENCE.md)
- [Workflows](./WORKFLOWS.md)

---

**Last Updated**: January 2025
**Maintained By**: Arc-Jr Team
**License**: MIT

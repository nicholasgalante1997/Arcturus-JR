# Void Design System - Quick Reference

Fast lookup for common patterns and commands.

## Installation

```bash
# Install all packages
bun add @arcjr/void-tokens @arcjr/void-css @arcjr/void-components
```

## CSS Loading

```html
<!-- Required order -->
<link rel="stylesheet" href="/css/tokens.css">       <!-- 1. Always first -->
<link rel="stylesheet" href="/css/void-reset.css">   <!-- 2. Always second -->
<link rel="stylesheet" href="/css/Button.css">       <!-- 3. Component CSS -->
<link rel="stylesheet" href="/css/app.css">          <!-- 4. App CSS last -->
```

## Design Tokens Quick Reference

### Colors
```css
/* Brand */
--void-color-brand-primary
--void-color-brand-secondary
--void-color-brand-tertiary

/* Semantic */
--void-color-semantic-success
--void-color-semantic-error
--void-color-semantic-warning
--void-color-semantic-info

/* Base */
--void-color-base-white
--void-color-base-black

/* Gray scale */
--void-color-gray-50 through --void-color-gray-900
```

### Spacing
```css
--void-spacing-0     /* 0 */
--void-spacing-1     /* 4px */
--void-spacing-2     /* 8px */
--void-spacing-3     /* 12px */
--void-spacing-4     /* 16px */
--void-spacing-6     /* 24px */
--void-spacing-8     /* 32px */
--void-spacing-12    /* 48px */
```

### Typography
```css
/* Font families */
--void-font-family-sans
--void-font-family-mono
--void-font-family-display

/* Font sizes */
--void-font-size-xs      /* 12px */
--void-font-size-sm      /* 14px */
--void-font-size-md      /* 16px */
--void-font-size-lg      /* 18px */
--void-font-size-xl      /* 20px */
--void-font-size-2xl     /* 24px */
--void-font-size-3xl     /* 30px */
--void-font-size-4xl     /* 36px */

/* Font weights */
--void-font-weight-normal
--void-font-weight-medium
--void-font-weight-semibold
--void-font-weight-bold
```

### Borders & Effects
```css
/* Radius */
--void-radius-sm
--void-radius-md
--void-radius-lg
--void-radius-full

/* Shadows */
--void-shadow-sm
--void-shadow-md
--void-shadow-lg

/* Transitions */
--void-transition-fast       /* 150ms */
--void-transition-normal     /* 250ms */
--void-transition-slow       /* 350ms */
```

## Component Usage

### Import Components
```typescript
import { Button, Card, Input } from '@arcjr/void-components';
```

### Button
```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

### Card
```tsx
<Card>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

### Input
```tsx
<Input placeholder="Enter text" />
<Input type="email" required />
<Input disabled />
```

## Tailwind Classes

### Colors
```tsx
<div className="bg-brand-primary text-base-white border-gray-200" />
```

### Spacing
```tsx
<div className="p-4 m-8 gap-2" />
```

### Typography
```tsx
<h1 className="text-3xl font-bold" />
<p className="text-md font-normal" />
```

### Layout
```tsx
<div className="flex items-center justify-between gap-4" />
<div className="grid grid-cols-3 gap-6" />
```

## BEM Naming Convention

```css
.void-component { }                    /* Block */
.void-component--variant { }           /* Modifier */
.void-component__element { }           /* Element */
```

### Examples
```css
.void-button { }
.void-button--primary { }
.void-button__icon { }
```

## Build Commands

```bash
# Development
bun run dev                    # Start dev server
bun run storybook              # Start Storybook

# Production
bun run build                  # Build everything
bun test                       # Run tests
bun run lint                   # Lint code
```

## Common Patterns

### Custom Component with Tokens
```css
/* MyComponent.css */
.my-component {
  padding: var(--void-spacing-4);
  background: var(--void-color-base-white);
  border-radius: var(--void-radius-md);
  box-shadow: var(--void-shadow-md);
}
```

```typescript
// MyComponent.tsx
import './MyComponent.css';

export function MyComponent({ children }) {
  return <div className="my-component">{children}</div>;
}
```

### Responsive Design
```css
.component {
  padding: var(--void-spacing-4);
}

@media (min-width: 768px) {
  .component {
    padding: var(--void-spacing-8);
  }
}
```

## Debugging

### Check Token
```bash
grep "void-color-brand-primary" packages/void-tokens/dist/tokens.css
```

### Verify CSS Loading
```bash
curl http://localhost:3000/css/tokens.css
```

### Check Build Output
```bash
ls packages/void-components/dist/css/
```

## Common Issues

### Styles Not Applying
```html
<!-- Verify load order -->
<link rel="stylesheet" href="/css/tokens.css">     <!-- First -->
<link rel="stylesheet" href="/css/void-reset.css"> <!-- Second -->
<link rel="stylesheet" href="/css/Button.css">     <!-- Third -->
```

### Build Fails
```bash
rm -rf dist node_modules/.cache
bun install
bun run build
```

## Resources

- [Full Documentation](./README.md)
- [Design Tokens](./TOKENS.md)
- [Components](./COMPONENTS.md)
- [Workflows](./WORKFLOWS.md)

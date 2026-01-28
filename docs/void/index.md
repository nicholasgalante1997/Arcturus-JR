# Void Design System Documentation

Welcome to the Void Design System documentation. This is your complete guide to understanding and working with the Void CSS architecture.

## Quick Links

- **[Complete Guide](./README.md)** - Full system documentation
- **[Design Tokens](./TOKENS.md)** - Complete token reference and usage guide
- **[Component Library](./COMPONENTS.md)** - Component catalog and development guide
- **[Build System](./BUILD-SYSTEM.md)** - Build pipeline, PostCSS, and optimization
- **[Migration Guide](./MIGRATION.md)** - Migrating from other CSS systems
- **[Quick Reference](./QUICK-REFERENCE.md)** - Cheat sheet and fast lookup
- **[Workflows](./WORKFLOWS.md)** - Step-by-step development guides

## What is Void?

Void is a comprehensive CSS design system for Arc-Jr consisting of:

1. **Design Tokens** (`@arcjr/void-tokens`) - Centralized design decisions as CSS variables
2. **CSS Utilities** (`@arcjr/void-css`) - Reset CSS and Tailwind integration
3. **Component Library** (`@arcjr/void-components`) - Pre-built React components
4. **PostCSS Pipeline** (`@arcjr/postcss-utils`) - Shared CSS processing tools

## Philosophy

### Vanilla CSS First

No CSS-in-JS. All styles are standard CSS files processed through PostCSS for maximum performance and compatibility.

### Token-Driven Design

Every design decision flows from centralized design tokens, ensuring consistency across the entire system.

### Build-Time Optimization

CSS is processed, optimized, and tree-shaken at build time, delivering the smallest possible bundles to users.

### Component Isolation

Each component owns its styles with no global pollution. Styles are scoped using BEM naming conventions.

## Getting Started

### Installation

```bash
# Install all Void packages
bun add @arcjr/void-tokens @arcjr/void-css @arcjr/void-components
```

### Basic Setup

1. **Add design tokens**:
```html
<link rel="stylesheet" href="/node_modules/@arcjr/void-tokens/dist/tokens.css">
```

2. **Add CSS reset**:
```html
<link rel="stylesheet" href="/node_modules/@arcjr/void-css/css/void-reset.css">
```

3. **Use components**:
```typescript
import { Button, Card } from '@arcjr/void-components';

function App() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
    </Card>
  );
}
```

4. **Import component CSS**:
```html
<link rel="stylesheet" href="/node_modules/@arcjr/void-components/dist/css/Button.css">
<link rel="stylesheet" href="/node_modules/@arcjr/void-components/dist/css/Card.css">
```

## Documentation Structure

- **[README.md](./README.md)** - Complete system overview, architecture, and usage guide
- **[TOKENS.md](./TOKENS.md)** - All design tokens with examples
- **[COMPONENTS.md](./COMPONENTS.md)** - Component architecture and catalog
- **[BUILD-SYSTEM.md](./BUILD-SYSTEM.md)** - Build configurations and optimization
- **[MIGRATION.md](./MIGRATION.md)** - Migration strategies from other systems
- **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** - Quick lookups and cheat sheets
- **[WORKFLOWS.md](./WORKFLOWS.md)** - Step-by-step task guides

## Quick Examples

### Using Design Tokens

```css
/* In CSS */
.component {
  color: var(--void-color-brand-primary);
  padding: var(--void-spacing-4);
  font-family: var(--void-font-family-sans);
}
```

```typescript
// In TypeScript
import { colors, spacing } from '@arcjr/void-tokens';

const style = {
  color: colors.brand.primary,
  padding: spacing[4],
};
```

```jsx
// In Tailwind
<div className="bg-brand-primary p-4 font-sans" />
```

### Creating Components

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

## Common Commands

```bash
# Development
bun run dev                    # Start dev server
bun run storybook              # Start Storybook

# Building
bun run build                  # Build everything
bun run build:packages         # Build packages only

# Testing
bun test                       # Run all tests
bun run lint                   # Lint code
bun run fmt                    # Format code
```

## Next Steps

1. Read the [Complete Guide](./README.md) for full system documentation
2. Explore [Design Tokens](./TOKENS.md) to understand available tokens
3. Check [Component Library](./COMPONENTS.md) for component patterns
4. Review [Workflows](./WORKFLOWS.md) for common development tasks

---

**Last Updated**: January 2025
**Maintained By**: Arc-Jr Team

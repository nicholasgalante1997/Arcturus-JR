# Void Design Tokens

Complete reference for all design tokens in the Void Design System.

## Overview

Design tokens are the atomic design decisions that define the visual language of the system. All tokens are defined in TypeScript and compiled to CSS custom properties.

## Token Categories

### Colors

**Location**: `packages/void-tokens/src/tokens/colors.ts`

#### Brand Colors
```typescript
colors.brand = {
  primary: '#007AFF',      // Primary brand color
  secondary: '#5856D6',    // Secondary brand color
  tertiary: '#FF9500',     // Tertiary brand color
};
```

**CSS Variables**:
```css
--void-color-brand-primary: #007AFF;
--void-color-brand-secondary: #5856D6;
--void-color-brand-tertiary: #FF9500;
```

**Tailwind Classes**:
```jsx
<div className="bg-brand-primary text-brand-secondary border-brand-tertiary" />
```

#### Semantic Colors
```typescript
colors.semantic = {
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF',
};
```

#### Gray Scale
```typescript
colors.gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};
```

### Spacing

**Location**: `packages/void-tokens/src/tokens/spacing.ts`

Based on 4px base unit:

```typescript
spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
};
```

**CSS Variables**:
```css
--void-spacing-0: 0;
--void-spacing-1: 0.25rem;
--void-spacing-4: 1rem;
--void-spacing-8: 2rem;
```

**Usage**:
```css
.component {
  padding: var(--void-spacing-4);      /* 16px */
  margin: var(--void-spacing-8);       /* 32px */
  gap: var(--void-spacing-2);          /* 8px */
}
```

### Typography

**Location**: `packages/void-tokens/src/tokens/typography.ts`

#### Font Families
```typescript
typography.fontFamily = {
  sans: "'Inter', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  display: "'Lexend', system-ui, sans-serif",
};
```

#### Font Sizes
```typescript
typography.fontSize = {
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  md: '1rem',         // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
};
```

#### Font Weights
```typescript
typography.fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};
```

### Borders

#### Border Radius
```typescript
borders.radius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',   // Fully rounded
};
```

**CSS Variables**:
```css
--void-radius-sm: 0.25rem;
--void-radius-md: 0.5rem;
--void-radius-full: 9999px;
```

### Transitions

```typescript
transitions.duration = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
};

transitions.easing = {
  ease: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
};
```

**Usage**:
```css
.button {
  transition: all var(--void-transition-fast);
}
```

### Shadows

```typescript
shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};
```

## Token Usage Patterns

### In CSS
```css
.component {
  color: var(--void-color-brand-primary);
  padding: var(--void-spacing-4);
  font-family: var(--void-font-family-sans);
  border-radius: var(--void-radius-md);
}
```

### In TypeScript
```typescript
import { colors, spacing } from '@arcjr/void-tokens';

const style = {
  color: colors.brand.primary,
  padding: spacing[4],
};
```

### In Tailwind
```jsx
<div className="bg-brand-primary p-4 rounded-md shadow-md" />
```

## Creating New Tokens

1. Define in TypeScript (`packages/void-tokens/src/tokens/`)
2. Build tokens: `bun run build`
3. Verify CSS output
4. Update Tailwind config if needed
5. Document in this file

---

See [README.md](./README.md) for complete documentation.

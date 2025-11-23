# Void Design System Rules

## Purpose
Define standards for extending and implementing components in the Void design system.

## Priority
**High**

## Instructions

### Component Architecture

**ALWAYS** follow component composition patterns from `.amazonq/rules/frontend/component-patterns.md` (ID: FOLLOW_COMPOSITION)

**ALWAYS** implement components in React with TypeScript (ID: REACT_TS)

**ALWAYS** separate Container and View components (ID: SEPARATE_CONCERNS)

### Styling Standards

**NEVER** use CSS-in-JS solutions (styled-components, emotion, Material-UI) (ID: NO_CSS_IN_JS)

**ALWAYS** use vanilla CSS with CSS variables from `@arcjr/void-tokens` (ID: VANILLA_CSS)

**ALWAYS** use `clsx` for conditional classes (ID: USE_CLSX)

```typescript
// Good - using clsx
import clsx from 'clsx';

const className = clsx(
  'void-button',
  variant && `void-button--${variant}`,
  disabled && 'void-button--disabled'
);
```

**ALWAYS** reference CSS variables from void-tokens (ID: VOID_CSS_VARS)

```css
.void-button {
  background-color: var(--color-brand-azure);
  padding: var(--spacing-3) var(--spacing-5);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-duration-fast) var(--transition-easing-ease);
}
```

**NEVER** import React in View components when using automatic JSX runtime (ID: NO_REACT_IMPORT_VIEWS)

```typescript
// Good
import { memo } from 'react';

// Bad
import React, { memo } from 'react';
```

### Component Documentation

**ALWAYS** include JSDoc comments in `Component.tsx` explaining (ID: JSDOC_REQUIRED):

- Component purpose and use cases
- Best practice usage patterns
- Examples of common scenarios

```typescript
/**
 * Button component for user interactions
 * 
 * @example
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * @example
 * // Disabled state
 * <Button disabled>
 *   Cannot click
 * </Button>
 */
```

### Storybook Integration

**ALWAYS** create Storybook CSF files co-located with components (ID: STORYBOOK_COLOCATED)

**ALWAYS** import component CSS in story files (ID: IMPORT_CSS_IN_STORIES)

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';
import './Button.css'; // Import CSS in story file

const meta: Meta<typeof Button> = {
  title: 'Void/Button',
  component: Button,
  tags: ['autodocs']
};
```

**ALWAYS** format stories with proper meta, args, and multiple variants (ID: WELL_FORMATTED_STORIES)

**ALWAYS** include stories for all component states and variants (ID: COMPREHENSIVE_STORIES)

### File Structure

**ALWAYS** organize Void components following this structure (ID: VOID_STRUCTURE):

```
packages/void-components/src/Button/
├── index.ts              # Barrel export
├── Component.tsx         # Container with JSDoc
├── View.tsx             # Presentational
├── types.ts             # TypeScript types
├── Button.css           # Vanilla CSS with Void variables
├── Button.stories.tsx   # Storybook stories (imports CSS)
└── __tests__/
    └── Button.test.tsx  # Bun tests
```

### CSS Organization

**NEVER** import CSS files directly into .tsx files except in .stories.tsx files (ID: NO_CSS_IMPORTS_TSX)

**ALWAYS** create separate CSS files for components (ID: SEPARATE_CSS)

**ALWAYS** use BEM-style naming with `void-` prefix (ID: VOID_BEM)

```css
.void-button { }
.void-button--primary { }
.void-button--disabled { }
.void-button__icon { }
```

### Build System

**ALWAYS** use Bun.build() programmatic API for bundling (ID: BUN_BUILD_API)

**ALWAYS** use separate functions for JS and CSS bundling (ID: SEPARATE_BUNDLE_FNS)

**ALWAYS** run type checking with `tsc` and `tsc-alias` after bundling (ID: TSC_AFTER_BUNDLE)

```typescript
// build.ts pattern
async function bundle() {
  const result = await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    target: 'browser',
    format: 'esm',
    sourcemap: 'external',
    minify: false,
    splitting: false,
    external: ['react', 'react-dom']
  });
}

async function bundleCSS() {
  const cssFiles = new Bun.Glob('src/**/*.css');
  const cssContent: string[] = [];
  for await (const file of cssFiles.scan('.')) {
    const content = await Bun.file(file).text();
    cssContent.push(`/* ${file} */\n${content}\n`);
  }
  await Bun.write('dist/index.css', cssContent.join('\n'));
}
```

### Package Configuration

**ALWAYS** use modern "files" and "exports" fields in package.json (ID: MODERN_PKG_JSON)

**ALWAYS** set "type": "module" (ID: TYPE_MODULE)

**ALWAYS** export both JS and CSS in exports field (ID: EXPORT_JS_CSS)

```json
{
  "type": "module",
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles": "./dist/index.css",
    "./package.json": "./package.json"
  }
}
```

### Storybook Configuration

**ALWAYS** use Vite aliases to resolve workspace packages (ID: VITE_ALIASES)

```typescript
// .storybook/main.ts
viteFinal: async (config) => {
  config.resolve.alias = {
    '@arcjr/void-tokens': resolve(__dirname, '../../void-tokens'),
    '@arcjr/void-css': resolve(__dirname, '../../void-css')
  };
  return config;
}
```

**ALWAYS** import void-tokens CSS in preview.ts (ID: TOKENS_IN_PREVIEW)

```typescript
// .storybook/preview.ts
import '@arcjr/void-tokens/dist/css/void-tokens.css';
```

### Testing

**ALWAYS** use Bun test runner with happy-dom (ID: BUN_TEST_HAPPYDOM)

**ALWAYS** use @testing-library/react for component tests (ID: TESTING_LIBRARY)

**ALWAYS** test accessibility attributes (aria-*, disabled, etc.) (ID: TEST_A11Y)

## Error Handling

Components should handle edge cases gracefully and provide clear error messages when props are invalid.

## Examples

### Complete Void Component

```typescript
// Component.tsx
import React from 'react';
import { pipeline } from '../utils/pipeline';
import ButtonView from './View';
import type { ButtonProps } from './types';

/**
 * Button component for primary user actions
 * 
 * Supports multiple variants and states. Use primary variant
 * for main actions, secondary for less important actions.
 * 
 * @example
 * <Button variant="primary" onClick={save}>Save</Button>
 */
function Button(props: ButtonProps) {
  return <ButtonView {...props} />;
}

export default pipeline(React.memo)(Button);

// View.tsx
import { memo } from 'react';
import clsx from 'clsx';
import { pipeline } from '../utils/pipeline';
import type { ButtonProps } from './types';

function ButtonView({ variant = 'primary', disabled, children, onClick }: ButtonProps) {
  return (
    <button
      className={clsx(
        'void-button',
        `void-button--${variant}`,
        disabled && 'void-button--disabled'
      )}
      disabled={disabled}
      onClick={onClick}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

export default pipeline(memo)(ButtonView);

// Button.css
.void-button {
  padding: var(--spacing-3) var(--spacing-5);
  border-radius: var(--border-radius-md);
  font-family: var(--font-family-base);
  cursor: pointer;
  border: none;
  transition: all var(--transition-duration-fast) var(--transition-easing-ease);
}

.void-button--primary {
  background-color: var(--color-brand-azure);
  color: var(--color-base-white);
}

.void-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';
import './Button.css';

const meta: Meta<typeof Button> = {
  title: 'Void/Button',
  component: Button,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button'
  }
};
```

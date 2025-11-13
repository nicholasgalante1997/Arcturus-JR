# Void Design System - Development Workflows

Step-by-step guides for common development tasks.

## Table of Contents

- [Adding a New Design Token](#adding-a-new-design-token)
- [Creating a New Component](#creating-a-new-component)
- [Updating Component Styles](#updating-component-styles)
- [Setting Up a New Page](#setting-up-a-new-page)
- [Debugging Build Issues](#debugging-build-issues)

---

## Adding a New Design Token

### Steps

1. **Add to TypeScript definition**
   ```typescript
   // packages/void-tokens/src/tokens/colors.ts
   export const colors = {
     brand: {
       primary: '#007AFF',
       secondary: '#5856D6',
       tertiary: '#FF9500',  // ← New token
     }
   };
   ```

2. **Build tokens package**
   ```bash
   cd packages/void-tokens
   bun run build
   ```

3. **Verify CSS output**
   ```bash
   grep "void-color-brand-tertiary" dist/tokens.css
   # Should output: --void-color-brand-tertiary: #FF9500;
   ```

4. **Update Tailwind config** (if using Tailwind)
   ```javascript
   // packages/void-css/tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         colors: {
           brand: {
             tertiary: 'var(--void-color-brand-tertiary)',
           }
         }
       }
     }
   };
   ```

5. **Use in components**
   ```css
   .test-element {
     background: var(--void-color-brand-tertiary);
   }
   ```
   ```jsx
   <div className="bg-brand-tertiary">Test</div>
   ```

### Checklist

- [ ] Token defined in TypeScript
- [ ] Tokens package built
- [ ] CSS variable verified
- [ ] Tailwind config updated (if applicable)
- [ ] Tested in app
- [ ] Documentation updated

---

## Creating a New Component

### Steps

1. **Create directory structure**
   ```bash
   cd packages/void-components/src
   mkdir Badge
   cd Badge
   touch index.ts Component.tsx View.tsx types.ts Badge.css Badge.stories.tsx
   mkdir __tests__
   touch __tests__/Badge.test.tsx
   ```

2. **Define types** (`types.ts`)
   ```typescript
   export type BadgeVariant = 'info' | 'success' | 'warning' | 'error';
   
   export interface BadgeProps {
     variant?: BadgeVariant;
     children: React.ReactNode;
   }
   ```

3. **Create View** (`View.tsx`)
   ```typescript
   import { memo } from 'react';
   import clsx from 'clsx';
   import { pipeline } from '@/utils/pipeline';
   import type { BadgeProps } from './types';
   
   function BadgeView({ variant = 'info', children }: BadgeProps) {
     return (
       <span className={clsx('void-badge', `void-badge--${variant}`)}>
         {children}
       </span>
     );
   }
   
   export default pipeline(memo)(BadgeView);
   ```

4. **Create Container** (`Component.tsx`)
   ```typescript
   import { pipeline } from '@/utils/pipeline';
   import BadgeView from './View';
   import type { BadgeProps } from './types';
   
   /**
    * Badge component for status indicators
    * 
    * @example
    * <Badge variant="success">Active</Badge>
    */
   function Badge(props: BadgeProps) {
     return <BadgeView {...props} />;
   }
   
   export default pipeline(memo)(Badge);
   ```

5. **Create styles** (`Badge.css`)
   ```css
   .void-badge {
     display: inline-flex;
     align-items: center;
     padding: var(--void-spacing-1) var(--void-spacing-3);
     border-radius: var(--void-radius-full);
     font-size: var(--void-font-size-sm);
     font-weight: var(--void-font-weight-medium);
   }
   
   .void-badge--info {
     background: var(--void-color-semantic-info);
     color: var(--void-color-base-white);
   }
   
   .void-badge--success {
     background: var(--void-color-semantic-success);
     color: var(--void-color-base-white);
   }
   ```

6. **Create Storybook stories** (`Badge.stories.tsx`)
   ```typescript
   import type { Meta, StoryObj } from '@storybook/react';
   import Badge from './Component';
   import './Badge.css';
   
   const meta: Meta<typeof Badge> = {
     title: 'Void/Badge',
     component: Badge,
     tags: ['autodocs'],
   };
   
   export default meta;
   type Story = StoryObj<typeof Badge>;
   
   export const Info: Story = {
     args: { variant: 'info', children: 'Info' },
   };
   ```

7. **Create tests** (`__tests__/Badge.test.tsx`)
   ```typescript
   import { describe, it, expect } from 'bun:test';
   import { render, screen } from '@testing-library/react';
   import Badge from '../Component';
   
   describe('Badge', () => {
     it('renders with children', () => {
       render(<Badge>Test</Badge>);
       expect(screen.getByText('Test')).toBeDefined();
     });
   });
   ```

8. **Create barrel export** (`index.ts`)
   ```typescript
   export { default } from './Component';
   export type { BadgeProps, BadgeVariant } from './types';
   ```

9. **Export from package**
   ```typescript
   // Edit packages/void-components/src/index.ts
   export { default as Badge } from './Badge';
   export type { BadgeProps, BadgeVariant } from './Badge';
   ```

10. **Build and test**
    ```bash
    cd packages/void-components
    bun run build
    bun test
    bun run storybook
    ```

### Checklist

- [ ] Directory structure created
- [ ] Types defined
- [ ] View component implemented
- [ ] Container component with JSDoc
- [ ] CSS with Void tokens
- [ ] Storybook stories created
- [ ] Unit tests written
- [ ] Exported from package index
- [ ] Build successful
- [ ] Tests passing
- [ ] Verified in Storybook

---

## Updating Component Styles

### Steps

1. **Locate component CSS**
   ```bash
   cd packages/void-components/src/ComponentName
   code ComponentName.css
   ```

2. **Make changes**
   ```css
   .void-button {
     /* Add new styles using Void tokens */
     box-shadow: var(--void-shadow-sm);
     
     /* Update existing styles */
     padding: var(--void-spacing-3) var(--void-spacing-6);
   }
   ```

3. **Rebuild package**
   ```bash
   cd packages/void-components
   bun run build
   ```

4. **Test in Storybook**
   ```bash
   bun run storybook
   ```

5. **Test in application**
   ```bash
   cd ../../apps/web
   bun run dev
   ```

### Checklist

- [ ] CSS updated with Void tokens
- [ ] Package rebuilt
- [ ] Verified in Storybook
- [ ] Tested in application
- [ ] Tests updated if needed

---

## Setting Up a New Page

### Steps

1. **Create page component**
   ```bash
   cd apps/web/src/pages
   mkdir NewPage
   touch NewPage/index.tsx
   ```

2. **Implement page**
   ```typescript
   // NewPage/index.tsx
   import { Button, Card } from '@arcjr/void-components';
   
   export function NewPage() {
     return (
       <div className="container mx-auto px-4 py-8">
         <Card>
           <h1 className="text-3xl font-bold mb-4">New Page</h1>
           <Button variant="primary">Click Me</Button>
         </Card>
       </div>
     );
   }
   ```

3. **Add route**
   ```typescript
   // apps/web/src/routes.tsx
   import { NewPage } from './pages/NewPage';
   
   const routes = [
     {
       path: '/new-page',
       element: <NewPage />,
     },
   ];
   ```

4. **Configure page for prerendering**
   ```typescript
   // scripts/lib/pages.ts
   export const pages = [
     {
       path: '/new-page',
       queries: [],
       styles: [
         '/css/tokens.css',
         '/css/void-reset.css',
         '/css/Button.css',
         '/css/Card.css',
       ],
     },
   ];
   ```

5. **Test page**
   ```bash
   bun run dev
   # Navigate to http://localhost:3000/new-page
   ```

### Checklist

- [ ] Page component created
- [ ] Route added
- [ ] Page configured for prerendering
- [ ] Required CSS listed
- [ ] Tested in dev mode

---

## Debugging Build Issues

### Steps

1. **Identify the problem**
   ```bash
   bun run build --verbose
   ```

2. **Clear caches**
   ```bash
   rm -rf dist
   rm -rf node_modules/.cache
   rm -rf packages/*/dist
   bun install
   ```

3. **Build packages individually**
   ```bash
   cd packages/void-tokens && bun run build
   cd ../void-css && bun run build
   cd ../void-components && bun run build
   cd ../../apps/web && bun run build
   ```

4. **Check CSS generation**
   ```bash
   cat packages/void-tokens/dist/tokens.css
   ls packages/void-components/dist/css/
   ls apps/web/dist/css/
   ```

5. **Verify CSS load order**
   ```html
   <!-- Check HTML source -->
   <link rel="stylesheet" href="/css/tokens.css">     <!-- First -->
   <link rel="stylesheet" href="/css/void-reset.css"> <!-- Second -->
   <link rel="stylesheet" href="/css/Button.css">     <!-- Third -->
   ```

### Common Issues

**"Module not found"**
```bash
cd packages/void-components
bun run build
```

**"CSS variables not resolving"**
```bash
curl http://localhost:3000/css/tokens.css
```

**"Styles not applying"**
```bash
# Check browser DevTools → Sources
# Verify CSS files are loaded
```

### Checklist

- [ ] Build error identified
- [ ] Caches cleared
- [ ] Packages built individually
- [ ] CSS generation verified
- [ ] CSS load order verified

---

## Quick Commands Reference

```bash
# Create new component
cd packages/void-components/src && mkdir ComponentName

# Add new token
cd packages/void-tokens && code src/tokens/colors.ts

# Build specific package
cd packages/void-components && bun run build

# Test everything
bun test

# Start Storybook
bun run storybook
```

---

See [README.md](./README.md) for complete documentation.

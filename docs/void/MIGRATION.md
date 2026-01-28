# Migrating to Void Design System

Guide for migrating existing projects to the Void Design System.

## Migration Overview

This guide covers:
- Migrating from CSS-in-JS to Void
- Migrating from other CSS frameworks
- Incremental migration strategies
- Common migration patterns

## From CSS-in-JS

### Styled Components → Void

#### Before: Styled Components

```typescript
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 12px 24px;
  background: #007AFF;
  color: white;
  border-radius: 8px;
  
  &:hover {
    background: #0062CC;
  }
`;
```

#### After: Void Components

```css
/* Button.css */
.void-button {
  padding: var(--void-spacing-3) var(--void-spacing-6);
  background: var(--void-color-brand-primary);
  color: var(--void-color-base-white);
  border-radius: var(--void-radius-md);
}

.void-button:hover {
  background: var(--void-color-brand-secondary);
}
```

```typescript
// Button.tsx
import './Button.css';

export function Button({ children, ...props }) {
  return (
    <button className="void-button" {...props}>
      {children}
    </button>
  );
}
```

## Incremental Migration Strategy

### Step 1: Install Void Packages

```bash
bun add @arcjr/void-tokens @arcjr/void-css @arcjr/void-components
```

### Step 2: Add Design Tokens

```html
<link rel="stylesheet" href="/node_modules/@arcjr/void-tokens/dist/tokens.css">
```

### Step 3: Add Reset CSS

```html
<link rel="stylesheet" href="/node_modules/@arcjr/void-css/css/void-reset.css">
```

### Step 4: Migrate Component by Component

1. **Leaf components first**: Start with components that don't depend on others
2. **High-usage components**: Migrate frequently used components for maximum impact
3. **New components**: Use Void for all new development

### Step 5: Remove Old Dependencies

```bash
# Remove CSS-in-JS
bun remove styled-components @emotion/react @emotion/styled

# Clean up unused code
```

## Common Migration Patterns

### Pattern 1: Inline Styles → CSS Variables

**Before**:
```typescript
<div style={{ color: '#007AFF', padding: '16px' }}>
  Content
</div>
```

**After**:
```typescript
<div style={{ 
  color: 'var(--void-color-brand-primary)',
  padding: 'var(--void-spacing-4)'
}}>
  Content
</div>
```

**Best**: Use CSS class
```css
.content {
  color: var(--void-color-brand-primary);
  padding: var(--void-spacing-4);
}
```

### Pattern 2: Dynamic Styles → CSS Classes

**Before**:
```typescript
<button
  style={{
    background: isPrimary ? '#007AFF' : '#6c757d',
    padding: isLarge ? '16px 32px' : '8px 16px',
  }}
>
```

**After**:
```typescript
<button
  className={clsx(
    'void-button',
    isPrimary ? 'void-button--primary' : 'void-button--secondary',
    isLarge && 'void-button--lg'
  )}
>
```

## Migration Checklist

### Pre-Migration

- [ ] Audit current CSS architecture
- [ ] Identify CSS-in-JS usage
- [ ] Document custom components
- [ ] Set up Void packages
- [ ] Configure build pipeline

### During Migration

- [ ] Add design tokens globally
- [ ] Add CSS reset
- [ ] Migrate component styles to CSS files
- [ ] Replace styled components with Void components
- [ ] Update component props to use variants
- [ ] Remove CSS-in-JS imports
- [ ] Update tests

### Post-Migration

- [ ] Remove old dependencies
- [ ] Clean up unused code
- [ ] Update documentation
- [ ] Train team on new patterns
- [ ] Monitor bundle sizes

## Troubleshooting

### Issue: Styles Not Applying

**Cause**: CSS not loaded or wrong order

**Solution**:
```html
<!-- Verify load order -->
<link rel="stylesheet" href="/css/tokens.css">       <!-- 1 -->
<link rel="stylesheet" href="/css/void-reset.css">   <!-- 2 -->
<link rel="stylesheet" href="/css/component.css">    <!-- 3 -->
```

### Issue: Variables Not Resolving

**Cause**: Tokens not loaded

**Solution**:
```bash
# Verify tokens.css exists
cat node_modules/@arcjr/void-tokens/dist/tokens.css

# Check it's loaded
grep "tokens.css" dist/index.html
```

### Issue: Bundle Size Increased

**Cause**: Not removing old CSS-in-JS packages

**Solution**:
```bash
# Remove old dependencies
bun remove styled-components @emotion/react

# Check bundle size
bun run bundle:analyze
```

## Resources

- [Complete Guide](./README.md)
- [Design Tokens](./TOKENS.md)
- [Components](./COMPONENTS.md)
- [Workflows](./WORKFLOWS.md)

---

See [README.md](./README.md) for complete documentation.

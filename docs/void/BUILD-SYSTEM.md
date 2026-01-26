# Void Build System

Comprehensive guide to the Void Design System build pipeline, PostCSS configuration, and optimization strategies.

## Build Architecture

The build pipeline is orchestrated by Turborepo with four main stages:

```
Stage 1: void-tokens     → Generate CSS variables from TypeScript
Stage 2: void-css        → Process reset CSS and Tailwind config
Stage 3: void-components → Bundle components and process CSS
Stage 4: apps/web        → Consume all packages and build application
```

## Package Build Configurations

### void-tokens Build

**Location**: `packages/void-tokens/build.ts`

**Process**:
1. Read TypeScript token definitions
2. Transform to CSS custom properties with `--void-` prefix
3. Bundle TypeScript to JavaScript
4. Generate type definitions

**Output**:
```css
/* dist/tokens.css */
:root {
  --void-color-brand-primary: #007AFF;
  --void-spacing-1: 0.25rem;
  --void-font-family-sans: 'Inter', system-ui, sans-serif;
}
```

### void-css Build

**Location**: `packages/void-css/build.ts`

**PostCSS Pipeline**:
1. `autoprefixer` - Add vendor prefixes
2. `cssnano` - Minify and optimize

**Output**: Optimized `dist/void-reset.css`

### void-components Build

**Location**: `packages/void-components/build.ts`

**JavaScript Bundling**:
```typescript
await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  format: 'esm',
  splitting: true,  // Code splitting enabled
  minify: true,
  external: ['react', 'react-dom'],
});
```

**CSS Processing**:
- `postcss-import` - Resolve @import statements
- `tailwindcss` - Generate utility classes
- `autoprefixer` - Add vendor prefixes
- `cssnano` - Minify and optimize

### Application Build (apps/web)

**Webpack Configuration**:
- Entry: `src/bootstrap.tsx`
- Loader: SWC with thread-loader for parallel compilation
- Output: Code-split bundles with contenthash
- Optimization: Terser minification, vendor splitting

**CSS Loading Strategy**:
```html
<!-- Load order is critical -->
<link rel="stylesheet" href="/css/tokens.css">        <!-- 1. Tokens first -->
<link rel="stylesheet" href="/css/void-reset.css">    <!-- 2. Reset second -->
<link rel="stylesheet" href="/css/Button.css">        <!-- 3. Components third -->
<link rel="stylesheet" href="/css/app.css">           <!-- 4. App styles last -->
```

## Build Optimization Strategies

### 1. Tree Shaking

Enable in all packages:
```json
// package.json
{
  "sideEffects": false
}
```

### 2. Code Splitting

```typescript
// Automatic with React Router lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### 3. CSS Purging

```javascript
// Tailwind automatically purges unused utilities
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
};
```

### 4. Caching

```javascript
// Webpack config
output: {
  filename: '[name].[contenthash].js',
}
```

### 5. Parallel Compilation

```javascript
// webpack config
{
  test: /\.(ts|tsx)$/,
  use: [
    'thread-loader',  // Runs SWC in worker threads
    'swc-loader',
  ],
}
```

## Turborepo Pipeline

**turbo.json**:
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

**Build Order**:
1. void-tokens (no dependencies)
2. void-css (depends on void-tokens)
3. void-components (depends on void-tokens, void-css)
4. apps/web (depends on all void packages)

## Build Commands

```bash
# Development
bun run dev                    # Start dev server
bun run dev:packages           # Watch all packages

# Production
bun run build                  # Build everything
bun run build:packages         # Build packages only

# Testing
bun test                       # Run all tests
bun run storybook              # Start Storybook
```

## Performance Monitoring

```bash
# Analyze webpack bundle
bun run bundle:analyze

# Check package sizes
du -h packages/*/dist

# Track CSS bundle sizes
ls -lh dist/css/*.css
```

## Troubleshooting

### Build Fails

```bash
# Clear caches and rebuild
rm -rf dist node_modules/.cache
bun install
bun run build --verbose
```

### CSS Not Updating

```bash
# Clear PostCSS cache
rm -rf node_modules/.cache

# Rebuild from scratch
bun run clean && bun run build
```

### Slow Builds

```bash
# Profile Webpack
webpack --profile --json > stats.json

# Analyze with webpack-bundle-analyzer
npx webpack-bundle-analyzer stats.json
```

## Resources

- [PostCSS Documentation](https://postcss.org/)
- [Turborepo Guide](https://turbo.build/)
- [Webpack Documentation](https://webpack.js.org/)

---

See [README.md](./README.md) for complete documentation.

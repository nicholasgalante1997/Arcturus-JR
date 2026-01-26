# SPEC-01: Tailwind v4 Integration with PostCSS

## Context

This spec establishes the foundation for Tailwind CSS v4 integration within the `@arcjr/void-css` package. Tailwind v4 uses a new CSS-first configuration approach and integrates via `@tailwindcss/postcss` plugin.

This is the first spec in the V2 migration series. All subsequent styling work depends on this foundation.

## Prerequisites

- Bun runtime installed (v1.3+)
- Turborepo monorepo structure in place
- `@arcjr/void-tokens` package built and functional

## Requirements

### 1. Update void-css PostCSS Configuration

The current PostCSS config has plugins in wrong order. Tailwind must process first, then autoprefixer/cssnano.

Update `packages/void-css/postcss.config.mjs`:

```javascript
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default {
  plugins: [
    // Tailwind MUST be first - it generates the utility classes
    tailwindcss({}),
    // Autoprefixer adds vendor prefixes
    autoprefixer({
      overrideBrowserslist: ["> 1%", "last 2 versions", "not dead"],
    }),
    // cssnano minifies (only in production ideally, but fine for build)
    cssnano({
      preset: [
        "default",
        {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
        },
      ],
    }),
  ],
};
```

### 2. Create Tailwind CSS Entry Point

Create `packages/void-css/css/void-tailwind.css`:

```css
/* Tailwind v4 CSS-first configuration */
@import "tailwindcss";

/* Import void design tokens as CSS custom properties */
@import "@arcjr/void-tokens/dist/css/void-tokens.css";

/* Configure Tailwind theme using void tokens */
@theme {
  /* Colors - mapped from void tokens */
  --color-void-black: var(--void-color-base-black);
  --color-void-white: var(--void-color-base-white);
  --color-void-gray-50: var(--void-color-gray-50);
  --color-void-gray-100: var(--void-color-gray-100);
  --color-void-gray-200: var(--void-color-gray-200);
  --color-void-gray-300: var(--void-color-gray-300);
  --color-void-gray-400: var(--void-color-gray-400);
  --color-void-gray-500: var(--void-color-gray-500);
  --color-void-gray-600: var(--void-color-gray-600);
  --color-void-gray-700: var(--void-color-gray-700);
  --color-void-gray-800: var(--void-color-gray-800);
  --color-void-gray-900: var(--void-color-gray-900);
  --color-void-gray-950: var(--void-color-gray-950);

  /* Brand colors */
  --color-void-violet: var(--void-color-brand-violet);
  --color-void-azure: var(--void-color-brand-azure);
  --color-void-cyan: var(--void-color-brand-cyan);
  --color-void-rose: var(--void-color-brand-rose);
  --color-void-amber: var(--void-color-brand-amber);

  /* Semantic colors */
  --color-void-success: var(--void-color-semantic-success);
  --color-void-warning: var(--void-color-semantic-warning);
  --color-void-error: var(--void-color-semantic-error);
  --color-void-info: var(--void-color-semantic-info);

  /* Typography */
  --font-family-base: var(--void-font-family-base);
  --font-family-mono: var(--void-font-family-mono);
  --font-family-display: var(--void-font-family-display);

  /* Spacing scale (extends Tailwind defaults) */
  --spacing-px: 1px;
  --spacing-0: 0;
  --spacing-1: var(--void-spacing-1);
  --spacing-2: var(--void-spacing-2);
  --spacing-3: var(--void-spacing-3);
  --spacing-4: var(--void-spacing-4);
  --spacing-5: var(--void-spacing-5);
  --spacing-6: var(--void-spacing-6);
  --spacing-8: var(--void-spacing-8);
  --spacing-10: var(--void-spacing-10);
  --spacing-12: var(--void-spacing-12);
  --spacing-16: var(--void-spacing-16);
  --spacing-20: var(--void-spacing-20);
  --spacing-24: var(--void-spacing-24);

  /* Border radius */
  --radius-sm: var(--void-border-radius-sm);
  --radius-md: var(--void-border-radius-md);
  --radius-lg: var(--void-border-radius-lg);
  --radius-xl: var(--void-border-radius-xl);
  --radius-full: var(--void-border-radius-full);

  /* Shadows */
  --shadow-sm: var(--void-shadow-sm);
  --shadow-md: var(--void-shadow-md);
  --shadow-lg: var(--void-shadow-lg);
  --shadow-xl: var(--void-shadow-xl);

  /* Transitions */
  --transition-fast: var(--void-transition-duration-fast);
  --transition-normal: var(--void-transition-duration-normal);
  --transition-slow: var(--void-transition-duration-slow);
  --ease-default: var(--void-transition-easing-ease);
}

/* Base layer customizations */
@layer base {
  html {
    font-family: var(--font-family-base);
    background-color: var(--color-void-black);
    color: var(--color-void-white);
  }

  ::selection {
    background-color: var(--color-void-violet);
    color: var(--color-void-white);
  }

  /* Focus visible styles */
  :focus-visible {
    outline: 2px solid var(--color-void-violet);
    outline-offset: 2px;
  }
}
```

### 3. Update void-css Package Exports

Update `packages/void-css/package.json` exports to include theme-aware entry:

```json
{
  "exports": {
    "./postcss-config": "./postcss.config.mjs",
    "./postcss.config.mjs": "./postcss.config.mjs",
    "./postcss.config.js": "./postcss.config.mjs",
    "./void": "./dist/void.min.css",
    "./void.css": "./dist/void.min.css",
    "./void-raw": "./css/void.css",
    "./void-raw.css": "./css/void.css",
    "./void-reset": "./dist/void-reset.min.css",
    "./void-reset.css": "./dist/void-reset.min.css",
    "./void-reset-raw": "./css/void-reset.css",
    "./void-reset-raw.css": "./css/void-reset.css",
    "./void-tailwind": "./dist/void-tailwind.min.css",
    "./void-tailwind.css": "./dist/void-tailwind.min.css",
    "./void-tailwind-raw": "./css/void-tailwind.css",
    "./void-tailwind-raw.css": "./css/void-tailwind.css",
    "./tailwind-theme": "./css/void-tailwind.css",
    "./css.min/*": "./dist/*",
    "./css/*": "./css/*",
    "./package.json": "./package.json"
  }
}
```

### 4. Add Build Script for Tailwind

Update `packages/void-css/package.json` scripts:

```json
{
  "scripts": {
    "build": "bun run postcss:all",
    "postcss:all": "postcss ./css --dir dist --base ./css --ext .min.css",
    "postcss:watch": "postcss ./css --dir dist --base ./css --ext .min.css --watch",
    "clean": "rm -rf dist",
    "serve:css": "bunx http-server ./css -p 8080 --open"
  }
}
```

### 5. Verify Token Integration

Ensure `@arcjr/void-tokens` exports CSS variables correctly.

Check that `packages/void-tokens/dist/css/void-tokens.css` exists and contains:

```css
:root {
  --void-color-base-black: #0a0a0f;
  --void-color-base-white: #fafafa;
  --void-color-gray-50: #f7f7f8;
  /* ... all other tokens ... */
}
```

If missing, run `bun run build` in `packages/void-tokens`.

### 6. Test Tailwind Build

Create a test file to verify the build works:

```bash
cd packages/void-css
bun run build
```

Verify `dist/void-tailwind.min.css` is generated and contains:
- Tailwind base styles
- Utility classes (should be minimal without content scanning)
- Void token CSS variables

## Acceptance Criteria

- [ ] `postcss.config.mjs` has plugins in correct order (tailwind → autoprefixer → cssnano)
- [ ] `void-tailwind.css` imports Tailwind and void tokens
- [ ] `@theme` block maps void tokens to Tailwind theme variables
- [ ] `bun run build` in void-css completes without errors
- [ ] `dist/void-tailwind.min.css` is generated and minified
- [ ] CSS variables from void-tokens are accessible in the output
- [ ] Package exports updated for new entry points

## Notes for Implementation

- Tailwind v4 uses CSS-first configuration via `@theme` directive
- No `tailwind.config.js` needed - everything in CSS
- The `@tailwindcss/postcss` plugin handles all Tailwind processing
- Token import path may need adjustment based on how void-tokens builds
- Content scanning (for tree-shaking) will be configured in SPEC-03 when integrating with apps/web

## Verification Commands

```bash
# Build void-tokens first (if not already)
cd packages/void-tokens && bun run build

# Build void-css
cd packages/void-css && bun run build

# Check output exists and has content
ls -la dist/
head -50 dist/void-tailwind.min.css
```

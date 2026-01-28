# SPEC-03: Build Pipeline Integration

## Context

This spec integrates the Tailwind/PostCSS pipeline into the `apps/web` build process. The goal is to enable Tailwind utility classes in V2 components while maintaining the existing prerender workflow.

## Prerequisites

- SPEC-01 completed (Tailwind v4 in void-css)
- SPEC-02 completed (void-css modules expanded)
- apps/web Webpack build functional

## Requirements

### 1. Add PostCSS Configuration to apps/web

Create `apps/web/postcss.config.mjs`:

```javascript
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

const isProduction = process.env.NODE_ENV === "production";

export default {
  plugins: [
    // Tailwind processes @tailwind directives and utility classes
    tailwindcss({
      // Content paths for tree-shaking unused utilities
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/**/*.html",
        // Include void-components for class extraction
        "../../packages/void-components/src/**/*.{js,jsx,ts,tsx}",
      ],
    }),
    // Add vendor prefixes
    autoprefixer({
      overrideBrowserslist: ["> 1%", "last 2 versions", "not dead"],
    }),
    // Minify in production
    ...(isProduction
      ? [
          cssnano({
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
              },
            ],
          }),
        ]
      : []),
  ],
};
```

### 2. Create V2 CSS Entry Point

Create `apps/web/public/css/v2.css`:

```css
/**
 * V2 CSS Entry Point
 * Combines Tailwind with Void design system
 */

/* Tailwind base, components, utilities */
@import "tailwindcss";

/* Void design tokens */
@import "@arcjr/void-tokens/dist/css/void-tokens.css";

/* Void CSS utilities */
@import "@arcjr/void-css/void-raw";

/* Void React components CSS */
@import "@arcjr/void-components/void-react.css";

/* Configure Tailwind theme with void tokens */
@theme {
  /* Map void tokens to Tailwind theme */
  --color-void-black: var(--void-color-base-black);
  --color-void-white: var(--void-color-base-white);

  /* Gray scale */
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

  /* Spacing */
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

  /* Z-index scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}

/* V2-specific base layer overrides */
@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: var(--font-family-base);
    background-color: var(--color-void-black);
    color: var(--color-void-white);
  }

  /* Ensure app container fills viewport */
  #app-v2 {
    min-height: calc(100vh - var(--header-height, 80px));
  }
}

/* V2-specific component layer */
@layer components {
  /* Container utility matching void-container */
  .container {
    width: 100%;
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
  }

  @media (min-width: 640px) {
    .container {
      padding-left: var(--spacing-6);
      padding-right: var(--spacing-6);
    }
  }

  @media (min-width: 1024px) {
    .container {
      padding-left: var(--spacing-8);
      padding-right: var(--spacing-8);
    }
  }
}
```

### 3. Update apps/web Package Dependencies

Add PostCSS dependencies to `apps/web/package.json`:

```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.18",
    "autoprefixer": "^10.4.23",
    "cssnano": "^7.1.2",
    "postcss": "^8.5.6",
    "postcss-cli": "^11.0.1",
    "postcss-loader": "^8.1.1",
    "tailwindcss": "^4.1.18"
  }
}
```

### 4. Add PostCSS Build Script

Update `apps/web/package.json` scripts:

```json
{
  "scripts": {
    "postcss": "postcss public/css/v2.css -o public/css/v2.min.css",
    "postcss:watch": "postcss public/css/v2.css -o public/css/v2.min.css --watch",
    "build": "bun run clean && bun run bundle && bun run postcss && bun run copy-static && bun run prerender",
    "dev": "concurrently \"bun run webpack:dev\" \"bun run postcss:watch\""
  }
}
```

### 5. Update Route Configuration for V2 Styles

Update `packages/config/src/configs/routes/v2.ts`:

```typescript
import {
  type RouteConfiguration,
  RouteConfigurationPathKeysEnum,
  ArcPageEnum,
  ArcPrerenderStaticRouteEnum,
  ArcBrowserRuntimeRoutesEnum,
} from "@arcjr/types";

// V2 uses the new Tailwind-enabled CSS
export const BASE_V2_CSS = ["/css/v2.min.css"] as const;

export const V2_HomePageRouteConfiguration: Readonly<
  RouteConfiguration<"getPosts", {}>
> = {
  page: ArcPageEnum.v2_HOME,
  type: "static",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: ArcBrowserRuntimeRoutesEnum.v2_Home,
    [RouteConfigurationPathKeysEnum.Static]: ArcPrerenderStaticRouteEnum.v2_HOME,
  },
  index: true,
  styles: [...BASE_V2_CSS],
  queries: [
    {
      queryKey: ["posts"],
      queryFnName: "getPosts",
      queryFnParams: {},
    },
  ],
} as const;

// ... rest of V2 route configurations
```

### 6. Update Types for V2 CSS

Ensure `packages/types/lib/config/routes.ts` exports the V2 CSS constant:

```typescript
// Add to existing exports
export const BASE_V2_CSS = ["/css/v2.min.css"] as const;
```

### 7. Turbo Pipeline Update

Update `turbo.json` to include PostCSS in the build pipeline:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", "!.turbo/**"],
      "outputs": ["dist/**", "public/css/**/*.min.css"],
      "cache": true
    },
    "postcss": {
      "dependsOn": ["^build"],
      "inputs": ["public/css/**/*.css", "postcss.config.mjs", "src/**/*.{ts,tsx}"],
      "outputs": ["public/css/**/*.min.css"],
      "cache": true
    }
  }
}
```

### 8. Webpack Configuration (Optional PostCSS Loader)

If you want Tailwind processed via Webpack (for HMR during dev), update the Webpack config.

Create/update `apps/web/webpack/rules/postcss.mjs`:

```javascript
import path from "path";

export const postcssRule = {
  test: /\.css$/,
  include: [
    path.resolve(process.cwd(), "public/css"),
    /node_modules\/@arcjr/,
  ],
  use: [
    "style-loader",
    {
      loader: "css-loader",
      options: {
        importLoaders: 1,
      },
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          config: path.resolve(process.cwd(), "postcss.config.mjs"),
        },
      },
    },
  ],
};
```

**Note**: This is optional. The recommended approach is to pre-build CSS with the `postcss` script and include via `<link>` tags (already working via prerender).

### 9. Verify Build Order

The build process should now be:

```txt
1. turbo build (triggers all package builds)
   ├── void-tokens build (generates CSS vars)
   ├── void-css build (generates CSS utilities)
   ├── void-components build (generates React + CSS)
   └── apps/web build
       ├── webpack bundle (JS/TSX)
       ├── postcss (v2.css → v2.min.css)
       ├── copy-static (assets to dist)
       └── prerender (React → HTML)
```

## Acceptance Criteria

- [ ] `postcss.config.mjs` exists in apps/web with correct plugin order
- [ ] `public/css/v2.css` imports Tailwind and all void packages
- [ ] `bun run postcss` generates `public/css/v2.min.css`
- [ ] V2 route configuration references `/css/v2.min.css`
- [ ] `bun run build` completes with PostCSS step included
- [ ] Tailwind utilities are tree-shaken (only used classes in output)
- [ ] V2 pages render with correct styles after prerender
- [ ] No style conflicts between V1 and V2 CSS

## Notes

- Tailwind v4's content scanning is configured via PostCSS plugin options
- Keep V1 CSS separate (`/css/styles.min.css`) - no changes to V1 routes
- The `@theme` block in v2.css maps void tokens to Tailwind's theme system
- For dev, you can run `postcss:watch` alongside `webpack:dev`

## Verification Commands

```bash
cd apps/web

# Install new dependencies
bun install

# Build PostCSS
bun run postcss

# Check output
ls -la public/css/v2.min.css
head -100 public/css/v2.min.css

# Full build (should include postcss step)
bun run build

# Verify prerendered HTML includes v2.min.css
grep "v2.min.css" dist/v2/index.html
```

## Troubleshooting

### PostCSS Not Finding Tailwind

Ensure `@tailwindcss/postcss` is installed and the import path is correct:

```javascript
// Correct
import tailwindcss from "@tailwindcss/postcss";

// Incorrect (Tailwind v3 style)
import tailwindcss from "tailwindcss";
```

### Styles Not Applied

1. Check that `v2.min.css` is linked in the route config
2. Verify prerender includes the `<link>` tag in output HTML
3. Ensure CSS variables from void-tokens are resolving

### Build Order Issues

If void-tokens CSS is not found, ensure turbo runs package builds before apps/web:

```json
{
  "dependsOn": ["^build"]
}
```

This ensures all workspace dependencies build first.

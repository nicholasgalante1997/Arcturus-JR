
# SPEC-01 to SPEC-09 Remediation Plan

## Executive Summary

The automated spec-driven development session implementing SPEC-01 through SPEC-09 made changes that are intentional per the
specs but require validation and completion. The key finding is:

1. SPEC-01 changes are correct - postcss.config.mjs, void-tailwind.css, package.json are properly configured
2. SPEC-02 changes are correct - The CSS files were intentionally rewritten per spec (not errors)
3. The old CSS subdirectories are intentionally orphaned - The new design system replaces them
4. void-components has new components but CSS is not fully bundled - Missing from void-components.css
5. apps/web V2 components exist but CSS integration needs verification

## Current State Analysis

packages/void-css/
  ┌───────────────────────┬────────────────┬─────────────────────────────────────────┐
  │         File          │     Status     │                  Notes                  │
  ├───────────────────────┼────────────────┼─────────────────────────────────────────┤
  │ postcss.config.mjs    │ ✅ Correct     │ Tailwind → Autoprefixer → cssnano order │
  ├───────────────────────┼────────────────┼─────────────────────────────────────────┤
  │ package.json          │ ✅ Correct     │ Exports and scripts per SPEC-01         │
  ├───────────────────────┼────────────────┼─────────────────────────────────────────┤
  │ css/void-tailwind.css │ ✅ Correct     │ @theme block with void tokens           │
  ├───────────────────────┼────────────────┼─────────────────────────────────────────┤
  │ css/void-reset.css    │ ✅ Per SPEC-02 │ Modern minimal reset (replaces old)     │
  ├───────────────────────┼────────────────┼─────────────────────────────────────────┤
  │ css/void-base.css     │ ✅ Per SPEC-02 │ Typography + base styles                │
  ├───────────────────────┼────────────────┼─────────────────────────────────────────┤
  │ css/void-layout.css   │ ✅ Per SPEC-02 │ New layout utilities                    │
  ├───────────────────────┼────────────────┼─────────────────────────────────────────┤
  │ css/void-forms.css    │ ✅ Per SPEC-02 │ New form utilities                      │
  ├───────────────────────┼────────────────┼─────────────────────────────────────────┤
  │ css/void-font.css     │ ✅ Per SPEC-02 │ Simplified font loading                 │
  ├───────────────────────┼────────────────┼─────────────────────────────────────────┤
  │ css/void.css          │ ✅ Per SPEC-02 │ New import structure                    │
  └───────────────────────┴────────────────┴─────────────────────────────────────────┘

Orphaned directories (intentional per SPEC-02 design decision):

- css/layout/ - 9 original layout files
- css/vendor/ - modern-normalize.css
- css/components/ - original component CSS

packages/void-components/
  ┌────────────┬─────────────┬────────────────┬────────────────────┐
  │ Component  │ Files Exist │    CSS File    │       Notes        │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Badge      │ ✅          │ ✅ Built       │ Original component │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Button     │ ✅          │ ✅ Built       │ Original component │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Card       │ ✅          │ ✅ Built       │ Original component │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Input      │ ✅          │ ⚠ Not bundled │ SPEC-04            │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Textarea   │ ✅          │ ⚠ Not bundled │ SPEC-04            │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Select     │ ✅          │ ⚠ Not bundled │ SPEC-04            │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Checkbox   │ ✅          │ ⚠ Not bundled │ SPEC-04            │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Container  │ ✅          │ ⚠ Not bundled │ SPEC-05            │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Stack      │ ✅          │ ⚠ Not bundled │ SPEC-05            │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Grid       │ ✅          │ ⚠ Not bundled │ SPEC-05            │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Divider    │ ✅          │ ⚠ Not bundled │ SPEC-05            │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Link       │ ✅          │ ⚠ Not bundled │ SPEC-06            │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ NavLink    │ ✅          │ ⚠ Not bundled │ SPEC-06            │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Breadcrumb │ ✅          │ ⚠ Not bundled │ SPEC-06            │
  ├────────────┼─────────────┼────────────────┼────────────────────┤
  │ Menu       │ ✅          │ ⚠ Not bundled │ SPEC-06            │
  └────────────┴─────────────┴────────────────┴────────────────────┘

apps/web/
  ┌─────────────────────────────────────┬────────┬────────────────────────────────────┐
  │                Path                 │ Status │               Notes                │
  ├─────────────────────────────────────┼────────┼────────────────────────────────────┤
  │ src/components/v2/Header/           │ ✅     │ SPEC-07                            │
  ├─────────────────────────────────────┼────────┼────────────────────────────────────┤
  │ src/components/v2/Footer/           │ ✅     │ SPEC-08                            │
  ├─────────────────────────────────────┼────────┼────────────────────────────────────┤
  │ src/layout/v2/                      │ ✅     │ SPEC-09                            │
  ├─────────────────────────────────────┼────────┼────────────────────────────────────┤
  │ public/css/components/v2-header.css │ ✅     │ Created                            │
  ├─────────────────────────────────────┼────────┼────────────────────────────────────┤
  │ public/css/components/v2-footer.css │ ✅     │ Created                            │
  ├─────────────────────────────────────┼────────┼────────────────────────────────────┤
  │ public/css/layout/v2-app-layout.css │ ✅     │ Created                            │
  ├─────────────────────────────────────┼────────┼────────────────────────────────────┤
  │ public/css/v2.css                   │ ⚠     │ References old paths, needs update │
  └─────────────────────────────────────┴────────┴────────────────────────────────────┘

## Remediation Steps

### Phase 1: Validate void-css Build (5 min)

```bash
cd packages/void-css
bun run build
ls -la dist/

# Expected output:

- void.min.css
- void-reset.min.css
- void-base.min.css
- void-layout.min.css
- void-forms.min.css
- void-font.min.css
- void-tailwind.min.css
```

### Phase 2: Build void-components with all CSS (15 min)

Action 1: Verify each new component has a CSS file:

```bash
  ls packages/void-components/src/*/\*.css
```

Action 2: Update void-components build to include all component CSS files

Action 3: Rebuild void-components:

```bash
  cd packages/void-components
  bun run build
```

Action 4: Verify output includes all component CSS

Phase 3: Update apps/web v2.css imports (10 min)

Current v2.css has incorrect paths:
  @import './void/void-min/dist/void-base.min.css';  /*Incorrect path*/

  Update to correct paths based on void-css package output

Phase 4: Verify V2 Header/Footer Components (10 min)

  1. Check apps/web/src/components/v2/Header/ matches SPEC-07
  2. Check apps/web/src/components/v2/Footer/ matches SPEC-08
  3. Check apps/web/src/layout/v2/ matches SPEC-09
  4. Verify CSS files in public/css/components/ and public/css/layout/

Phase 5: Integration Test (10 min)

  cd apps/web
  bun run dev

# Open <http://localhost:3000/v2>

# Verify Header, Footer, and layout render correctly

Decision Point: Old CSS Subdirectories

The original css/layout/, css/vendor/, and css/components/ directories in void-css are now orphaned. Two options:

Option A: Keep (Backward Compatibility)

- Leave files in place
- Add legacy export in package.json for apps that need them
- Pros: No breaking changes for existing consumers
- Cons: Technical debt, confusion

Option B: Remove (Clean Break)

- Delete orphaned directories
- Only new SPEC-02 CSS is supported
- Pros: Clean codebase, clear direction
- Cons: Breaking change for any existing consumers

Recommendation: Option A for now (keep files), defer cleanup to Phase 5 (SPEC-15) when doing full route migration.

Implementation Checklist

Step 1: Validate void-css

- Run bun run build in void-css
- Verify all .min.css files exist in dist/
- Check for build errors

Step 2: Update void-components build

- Check CSS files exist for all new components (Input, Textarea, Select, Checkbox, Container, Stack, Grid, Divider, Link,
  NavLink, Breadcrumb, Menu)
- Update build script to include all CSS
- Run bun run build in void-components
- Verify void-components.css includes all component styles

Step 3: Fix apps/web v2.css

- Update import paths to correct void-css dist locations
- Add imports for new void-components CSS
- Add imports for V2 Header/Footer/Layout CSS

Step 4: Validate V2 Components

- Check Header Component.tsx and View.tsx
- Check Footer Component.tsx and View.tsx
- Check AppLayout.tsx
- Verify CSS files match specs

Step 5: Test Build

- Run bun run build in apps/web
- Verify no errors
- Check that v2.min.css is generated (if using PostCSS)

Step 6: Visual Verification

- Run bun run dev
- Navigate to /v2
- Verify Header displays correctly
- Verify Footer displays correctly
- Test responsive behavior
- Check scroll-based header blur effect

Files to Modify

1. packages/void-components/build/utils/entrypoints.ts - Ensure CSS bundling includes all components
2. apps/web/public/css/v2.css - Fix import paths
3. Potentially: apps/web/src/layout/v2/AppLayout.tsx - Minor fixes if needed

Files to Verify (Read-Only)

1. All CSS files in packages/void-css/css/
2. All component folders in packages/void-components/src/
3. apps/web/src/components/v2/Header/
4. apps/web/src/components/v2/Footer/
5. apps/web/src/layout/v2/

  ---
Summary

The changes made are NOT incorrect - they follow SPEC-02 through SPEC-09. The issue is that:

1. The implementation is incomplete - void-components CSS not fully bundled
2. The apps/web v2.css has stale paths
3. The design decision in SPEC-02 to replace (not extend) the old CSS modules leaves orphaned files

Recommended next steps:

1. Complete the void-components build to include all new CSS
2. Fix v2.css import paths in apps/web
3. Validate builds work end-to-end
4. Visual test the V2 pages

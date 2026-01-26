# SPEC-09: V2 Layout Composition

## Context

This spec creates the V2 AppLayout component that composes Header and Footer with page content, integrates with React Router's Document component, and provides consistent structure across all V2 pages.

## Prerequisites

- SPEC-07 completed (V2 Header component)
- SPEC-08 completed (V2 Footer component)
- React Router 7 installed and configured
- TanStack Query provider set up

## Requirements

### 1. Layout Component Types

Create `apps/web/src/layout/v2/types.ts`:

```typescript
import type { ReactNode } from "react";

export interface V2AppLayoutProps {
  /** Page content to render between header and footer */
  children: ReactNode;
  /** Whether header should start transparent */
  transparentHeader?: boolean;
  /** Additional className for the layout wrapper */
  className?: string;
  /** Whether to show the footer (default: true) */
  showFooter?: boolean;
}
```

### 2. V2 AppLayout Component

Create `apps/web/src/layout/v2/AppLayout.tsx`:

```tsx
import { memo } from "react";
import clsx from "clsx";

import { V2Header } from "@/components/v2/Header";
import { V2Footer } from "@/components/v2/Footer";
import { pipeline } from "@/utils/pipeline";
import type { V2AppLayoutProps } from "./types";

function V2AppLayout({
  children,
  transparentHeader = false,
  className,
  showFooter = true,
}: V2AppLayoutProps) {
  return (
    <div className={clsx("v2-app-layout", className)}>
      <V2Header transparent={transparentHeader} />
      <main className="v2-app-layout__main" id="main-content">
        {children}
      </main>
      {showFooter && <V2Footer />}
    </div>
  );
}

export default pipeline(memo)(V2AppLayout);
```

### 3. Layout Styles

Create `apps/web/public/css/layout/v2-app-layout.css`:

```css
/**
 * V2 App Layout
 * Main layout structure for V2 pages
 */

.v2-app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--void-color-base-black);
  color: var(--void-color-base-white);
}

.v2-app-layout__main {
  flex: 1;
  padding-top: 64px; /* Header height */
  width: 100%;
}

/* Container utility for page content */
.v2-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--void-spacing-4);
}

@media (min-width: 640px) {
  .v2-container {
    padding: 0 var(--void-spacing-6);
  }
}

@media (min-width: 1024px) {
  .v2-container {
    padding: 0 var(--void-spacing-8);
  }
}

/* Section spacing utilities */
.v2-section {
  padding: var(--void-spacing-12) 0;
}

@media (min-width: 768px) {
  .v2-section {
    padding: var(--void-spacing-16) 0;
  }
}

@media (min-width: 1024px) {
  .v2-section {
    padding: var(--void-spacing-20) 0;
  }
}

/* Page transitions */
@media (prefers-reduced-motion: no-preference) {
  .v2-app-layout__main > * {
    animation: fade-in 0.3s ease-out;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 4. Document Component Integration

Create `apps/web/src/layout/v2/Document.tsx`:

```tsx
import { memo } from "react";
import type { ReactNode } from "react";

interface V2DocumentProps {
  children: ReactNode;
  title?: string;
  description?: string;
  styles?: string[];
}

/**
 * V2 Document component for React Router's document integration
 * Handles meta tags, title, and stylesheet links
 */
function V2Document({
  children,
  title = "Arc-Jr",
  description = "Modern blog built with React 19, TypeScript, and TanStack Query",
  styles = [],
}: V2DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <title>{title}</title>

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Base styles (always loaded) */}
        <link rel="stylesheet" href="/css/void/void.min.css" />
        <link rel="stylesheet" href="/css/void/void-tailwind.min.css" />
        <link rel="stylesheet" href="/css/layout/v2-app-layout.css" />
        <link rel="stylesheet" href="/css/components/v2-header.css" />
        <link rel="stylesheet" href="/css/components/v2-footer.css" />

        {/* Page-specific styles */}
        {styles.map((styleUrl) => (
          <link key={styleUrl} rel="stylesheet" href={styleUrl} />
        ))}
      </head>
      <body>
        {children}
        <div id="portal-root" />
      </body>
    </html>
  );
}

export default memo(V2Document);
```

### 5. Update Layout Index Exports

Create `apps/web/src/layout/v2/index.ts`:

```typescript
export { default as V2AppLayout } from "./AppLayout";
export { default as V2Document } from "./Document";
export type { V2AppLayoutProps } from "./types";
```

### 6. Page Wrapper Component

Create `apps/web/src/layout/v2/PageWrapper.tsx`:

```tsx
import { memo, Suspense } from "react";
import type { ReactNode } from "react";

import { V2AppLayout } from "./AppLayout";
import { ErrorBoundary } from "@/components/Base/ErrorBoundary";
import type { V2AppLayoutProps } from "./types";

interface PageWrapperProps extends Omit<V2AppLayoutProps, "children"> {
  children: ReactNode;
  /** Loading fallback for Suspense */
  fallback?: ReactNode;
}

const DefaultFallback = () => (
  <div className="v2-page-loading">
    <div className="v2-page-loading__spinner" />
    <p className="v2-page-loading__text">Loading...</p>
  </div>
);

/**
 * Page wrapper with layout, error boundary, and suspense
 * Use this for all V2 pages
 */
function PageWrapper({
  children,
  fallback = <DefaultFallback />,
  ...layoutProps
}: PageWrapperProps) {
  return (
    <ErrorBoundary>
      <V2AppLayout {...layoutProps}>
        <Suspense fallback={fallback}>{children}</Suspense>
      </V2AppLayout>
    </ErrorBoundary>
  );
}

export default memo(PageWrapper);
```

Create loading styles in `apps/web/public/css/layout/v2-app-layout.css` (append):

```css
/* Loading State */
.v2-page-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--void-spacing-4);
}

.v2-page-loading__spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--void-color-gray-800);
  border-top-color: var(--void-color-brand-violet);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.v2-page-loading__text {
  font-size: 0.875rem;
  color: var(--void-color-gray-400);
  margin: 0;
}
```

### 7. Example Page Usage

Example of how pages should use the layout:

```tsx
// apps/web/src/pages/v2_Home.tsx
import { V2HomePage } from "@/components/v2/Home";
import { PageWrapper } from "@/layout/v2/PageWrapper";

export default function V2HomeRoute() {
  return (
    <PageWrapper transparentHeader>
      <V2HomePage />
    </PageWrapper>
  );
}
```

### 8. Route Configuration Update

Update route configuration to include Document and layout styles:

```typescript
// Example route config structure
export const V2_HomePageRouteConfiguration = {
  page: "v2_HOME",
  type: "static",
  path: {
    browser: "/",
    static: "/v2/index.html",
  },
  index: true,
  document: V2Document,
  documentProps: {
    title: "Home | Arc-Jr",
    description: "Modern blog built with React 19",
    styles: ["/css/pages/v2-home.css"],
  },
  styles: [
    "/css/void/void.min.css",
    "/css/void/void-tailwind.min.css",
    "/css/layout/v2-app-layout.css",
    "/css/components/v2-header.css",
    "/css/components/v2-footer.css",
    "/css/pages/v2-home.css",
  ],
  queries: [
    {
      queryKey: ["posts"],
      queryFnName: "getPosts",
      queryFnParams: {},
    },
  ],
} as const;
```

## Acceptance Criteria

- [ ] V2AppLayout composes Header and Footer around content
- [ ] Main content area has proper padding for fixed header
- [ ] Footer sticks to bottom on short pages (flexbox)
- [ ] Document component integrates with React Router
- [ ] Page-specific styles load correctly
- [ ] Loading state displays during Suspense
- [ ] Error boundary catches and displays errors
- [ ] Page transitions animate smoothly
- [ ] Layout is fully responsive
- [ ] Skip to main content for accessibility (via id="main-content")

## Notes

- Layout uses flexbox for sticky footer pattern
- Header height (64px) accounted for in main padding
- Container utility provides consistent max-width
- Section utility provides consistent vertical spacing
- PageWrapper combines layout, ErrorBoundary, and Suspense
- Document component handles all meta tags and styles
- Portal root included for modals/tooltips
- Animations respect `prefers-reduced-motion`

## Verification

```bash
# Build and test
bun run dev
# Navigate to V2 pages
# Verify header stays fixed at top
# Verify footer at bottom
# Check responsive behavior
# Test loading states by throttling network
# Trigger error to test error boundary
```

## Integration Example

Complete page example:

```tsx
// apps/web/src/pages/v2_Home.tsx
import { PageWrapper } from "@/layout/v2/PageWrapper";
import { V2HomePage } from "@/components/v2/Home";

export default function V2HomeRoute() {
  return (
    <PageWrapper transparentHeader>
      <V2HomePage />
    </PageWrapper>
  );
}

// apps/web/src/components/v2/Home/Component.tsx
import { SuspenseEnabledQueryProvider } from "@/components/Base/SEQ";
import { useGetPosts } from "@/hooks/usePosts";
import V2HomePageView from "./View";

function V2HomePage() {
  const postsQuery = useGetPosts();

  return (
    <SuspenseEnabledQueryProvider>
      <V2HomePageView queries={[postsQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

// apps/web/src/components/v2/Home/View.tsx
import { use, memo } from "react";
import { pipeline } from "@/utils/pipeline";

function V2HomePageView({ queries }) {
  const [postsQuery] = queries;
  const posts = use(postsQuery.promise);

  return (
    <div className="v2-container">
      <div className="v2-section">
        {/* Page content */}
      </div>
    </div>
  );
}

export default pipeline(memo)(V2HomePageView);
```

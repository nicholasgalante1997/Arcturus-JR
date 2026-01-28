# SPEC-10: V2 Home Page

## Context

This spec completes the V2 Home page with a polished hero section, featured posts grid, and proper data fetching integration. This is the flagship page that demonstrates the full V2 design system.

## Prerequisites

- SPEC-01 through SPEC-09 completed (build pipeline, components, layout)
- V2 Header and Footer functional
- Posts data fetching hooks working

## Requirements

### 1. Update Home Page Types

Create `apps/web/src/components/v2/Home/types.ts`:

```typescript
import type { UseQueryResult } from "@tanstack/react-query";
import type { Post } from "@/types/Post";

export interface V2HomeViewProps {
  queries: [PostsQuery];
}

export type PostsQuery = UseQueryResult<Post[], Error>;

export interface HeroWidgetProps {
  /** Primary headline text */
  headline?: string;
  /** Subheadline/description text */
  subheadline?: string;
  /** Call-to-action button text */
  ctaText?: string;
  /** Call-to-action link destination */
  ctaHref?: string;
}

export interface FeaturedPostsProps {
  posts: Post[];
  /** Maximum number of posts to display */
  limit?: number;
}
```

### 2. Hero Widget Component

Update `apps/web/src/components/v2/Home/components/HeroWidget/View.tsx`:

```tsx
import React, { memo } from "react";
import { Link } from "react-router";
import clsx from "clsx";

import { pipeline } from "@/utils/pipeline";
import type { HeroWidgetProps } from "../../types";

const DEFAULT_HEADLINE = "Engineering the Future";
const DEFAULT_SUBHEADLINE =
  "Exploring software architecture, distributed systems, and the craft of building resilient applications.";
const DEFAULT_CTA_TEXT = "Read the Blog";
const DEFAULT_CTA_HREF = "/posts";

function HeroWidgetView({
  headline = DEFAULT_HEADLINE,
  subheadline = DEFAULT_SUBHEADLINE,
  ctaText = DEFAULT_CTA_TEXT,
  ctaHref = DEFAULT_CTA_HREF,
}: HeroWidgetProps) {
  return (
    <section className="v2-hero" aria-labelledby="hero-headline">
      <div className="v2-hero__content">
        <h1 id="hero-headline" className="v2-hero__headline">
          {headline}
        </h1>
        <p className="v2-hero__subheadline">{subheadline}</p>
        <div className="v2-hero__actions">
          <Link to={ctaHref} className="v2-hero__cta void-button void-button--primary">
            {ctaText}
            <svg
              className="v2-hero__cta-icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 10h12m0 0l-4-4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className="v2-hero__decoration" aria-hidden="true">
        <div className="v2-hero__glow v2-hero__glow--primary" />
        <div className="v2-hero__glow v2-hero__glow--secondary" />
      </div>
    </section>
  );
}

export default pipeline(memo)(HeroWidgetView);
```

Create `apps/web/src/components/v2/Home/components/HeroWidget/HeroWidget.css`:

```css
.v2-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--void-spacing-16) var(--void-spacing-4);
  text-align: center;
  overflow: hidden;
}

.v2-hero__content {
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.v2-hero__headline {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  background: linear-gradient(
    135deg,
    var(--void-color-base-white) 0%,
    var(--void-color-gray-300) 50%,
    var(--void-color-brand-violet) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--void-spacing-6);
}

.v2-hero__subheadline {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: 1.6;
  color: var(--void-color-gray-400);
  max-width: 600px;
  margin: 0 auto var(--void-spacing-8);
}

.v2-hero__actions {
  display: flex;
  gap: var(--void-spacing-4);
  justify-content: center;
  flex-wrap: wrap;
}

.v2-hero__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--void-spacing-2);
  padding: var(--void-spacing-3) var(--void-spacing-6);
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--void-border-radius-lg);
  transition: all var(--void-transition-duration-fast) var(--void-transition-easing-ease);
}

.v2-hero__cta-icon {
  transition: transform var(--void-transition-duration-fast) var(--void-transition-easing-ease);
}

.v2-hero__cta:hover .v2-hero__cta-icon {
  transform: translateX(4px);
}

/* Decorative glows */
.v2-hero__decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.v2-hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
}

.v2-hero__glow--primary {
  width: 600px;
  height: 600px;
  background: var(--void-color-brand-violet);
  top: -200px;
  right: -200px;
  animation: float-slow 20s ease-in-out infinite;
}

.v2-hero__glow--secondary {
  width: 400px;
  height: 400px;
  background: var(--void-color-brand-azure);
  bottom: -100px;
  left: -100px;
  animation: float-slow 25s ease-in-out infinite reverse;
}

@keyframes float-slow {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -30px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .v2-hero {
    min-height: 50vh;
    padding: var(--void-spacing-12) var(--void-spacing-4);
  }
}
```

### 3. Featured Posts Grid Component

Create `apps/web/src/components/v2/Home/components/FeaturedPosts/types.ts`:

```typescript
import type { Post } from "@/types/Post";

export interface FeaturedPostsProps {
  posts: Post[];
  limit?: number;
}

export interface PostCardV2Props {
  post: Post;
}
```

Create `apps/web/src/components/v2/Home/components/FeaturedPosts/PostCardV2.tsx`:

```tsx
import React, { memo } from "react";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";

import { pipeline } from "@/utils/pipeline";
import type { PostCardV2Props } from "./types";

function PostCardV2View({ post }: PostCardV2Props) {
  const formattedDate = formatDistanceToNow(new Date(post.date), {
    addSuffix: true,
  });

  return (
    <article className="v2-post-card">
      <Link to={`/post/${post.id}`} className="v2-post-card__link">
        {post.image && (
          <div className="v2-post-card__image-container">
            <img
              src={post.image}
              alt=""
              className="v2-post-card__image"
              loading="lazy"
            />
            <div className="v2-post-card__image-overlay" />
          </div>
        )}
        <div className="v2-post-card__content">
          <div className="v2-post-card__meta">
            {post.tags && post.tags.length > 0 && (
              <span className="v2-post-card__tag">{post.tags[0]}</span>
            )}
            <time className="v2-post-card__date" dateTime={post.date}>
              {formattedDate}
            </time>
          </div>
          <h3 className="v2-post-card__title">{post.title}</h3>
          {post.description && (
            <p className="v2-post-card__description">{post.description}</p>
          )}
          <span className="v2-post-card__read-more">
            Read more
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10m0 0L9 4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default pipeline(memo)(PostCardV2View);
```

Create `apps/web/src/components/v2/Home/components/FeaturedPosts/View.tsx`:

```tsx
import React, { memo } from "react";
import { Link } from "react-router";

import { pipeline } from "@/utils/pipeline";
import PostCardV2 from "./PostCardV2";
import type { FeaturedPostsProps } from "./types";

function FeaturedPostsView({ posts, limit = 6 }: FeaturedPostsProps) {
  const displayPosts = posts.slice(0, limit);

  return (
    <section className="v2-featured-posts" aria-labelledby="featured-posts-title">
      <header className="v2-featured-posts__header">
        <h2 id="featured-posts-title" className="v2-featured-posts__title">
          Latest Posts
        </h2>
        <Link to="/posts" className="v2-featured-posts__view-all">
          View all posts
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8h10m0 0L9 4m4 4l-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </header>
      <div className="v2-featured-posts__grid">
        {displayPosts.map((post) => (
          <PostCardV2 key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default pipeline(memo)(FeaturedPostsView);
```

Create `apps/web/src/components/v2/Home/components/FeaturedPosts/FeaturedPosts.css`:

```css
.v2-featured-posts {
  padding: var(--void-spacing-16) 0;
}

.v2-featured-posts__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--void-spacing-8);
}

.v2-featured-posts__title {
  font-size: var(--void-font-size-2xl);
  font-weight: 600;
  color: var(--void-color-base-white);
}

.v2-featured-posts__view-all {
  display: inline-flex;
  align-items: center;
  gap: var(--void-spacing-1);
  color: var(--void-color-brand-azure);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color var(--void-transition-duration-fast) var(--void-transition-easing-ease);
}

.v2-featured-posts__view-all:hover {
  color: var(--void-color-brand-violet);
}

.v2-featured-posts__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--void-spacing-6);
}

@media (min-width: 640px) {
  .v2-featured-posts__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .v2-featured-posts__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Post Card V2 */
.v2-post-card {
  background-color: var(--void-color-gray-900);
  border: var(--void-border-width-thin) solid var(--void-color-gray-800);
  border-radius: var(--void-border-radius-lg);
  overflow: hidden;
  transition: border-color var(--void-transition-duration-fast) var(--void-transition-easing-ease),
    transform var(--void-transition-duration-fast) var(--void-transition-easing-ease),
    box-shadow var(--void-transition-duration-fast) var(--void-transition-easing-ease);
}

.v2-post-card:hover {
  border-color: var(--void-color-brand-violet);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px -12px rgba(139, 92, 246, 0.25);
}

.v2-post-card__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.v2-post-card__image-container {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.v2-post-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--void-transition-duration-normal) var(--void-transition-easing-ease);
}

.v2-post-card:hover .v2-post-card__image {
  transform: scale(1.05);
}

.v2-post-card__image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--void-color-gray-900), transparent);
  opacity: 0.6;
}

.v2-post-card__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--void-spacing-4);
}

.v2-post-card__meta {
  display: flex;
  align-items: center;
  gap: var(--void-spacing-2);
  margin-bottom: var(--void-spacing-2);
}

.v2-post-card__tag {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--void-color-brand-violet);
  background-color: rgba(139, 92, 246, 0.15);
  padding: var(--void-spacing-1) var(--void-spacing-2);
  border-radius: var(--void-border-radius-sm);
}

.v2-post-card__date {
  font-size: 0.75rem;
  color: var(--void-color-gray-500);
}

.v2-post-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--void-color-base-white);
  margin-bottom: var(--void-spacing-2);
}

.v2-post-card__description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--void-color-gray-400);
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.v2-post-card__read-more {
  display: inline-flex;
  align-items: center;
  gap: var(--void-spacing-1);
  margin-top: var(--void-spacing-4);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--void-color-brand-azure);
}

.v2-post-card__read-more svg {
  transition: transform var(--void-transition-duration-fast) var(--void-transition-easing-ease);
}

.v2-post-card:hover .v2-post-card__read-more svg {
  transform: translateX(4px);
}
```

Create exports for FeaturedPosts:

```typescript
// apps/web/src/components/v2/Home/components/FeaturedPosts/index.ts
export { default as FeaturedPosts } from "./View";
export { default as PostCardV2 } from "./PostCardV2";
export type { FeaturedPostsProps, PostCardV2Props } from "./types";
```

### 4. Update Home Page View

Update `apps/web/src/components/v2/Home/View.tsx`:

```tsx
import React, { memo, use } from "react";

import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";

import { V2HeroWidget } from "./components/HeroWidget";
import { FeaturedPosts } from "./components/FeaturedPosts";
import type { V2HomeViewProps } from "./types";

function V2HomePageView({ queries }: V2HomeViewProps) {
  const [postsQuery] = queries;
  const posts = use(postsQuery.promise);

  return (
    <div className="v2-home-page">
      <V2HeroWidget />
      <FeaturedPosts posts={posts} limit={6} />
    </div>
  );
}

export default pipeline(memo, withProfiler("v2_Home_Page_View"))(V2HomePageView);
```

### 5. Update Home Page Container

Update `apps/web/src/components/v2/Home/Component.tsx`:

```tsx
import React, { memo } from "react";

import { SuspenseEnabledQueryProvider } from "@/components/Base/SEQ";
import { useGetPosts } from "@/hooks/usePosts";
import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";

import V2HomePageView from "./View";

function V2HomePage() {
  const postsQuery = useGetPosts();

  return (
    <SuspenseEnabledQueryProvider>
      <V2HomePageView queries={[postsQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(withProfiler("v2_Home_Page"), memo)(V2HomePage);
```

### 6. Add Page-Level CSS

Create `apps/web/public/css/pages/v2-home.css`:

```css
/**
 * V2 Home Page Styles
 * Imports component CSS and adds page-specific overrides
 */

.v2-home-page {
  min-height: 100vh;
}

/* Ensure proper spacing between sections */
.v2-home-page > section {
  position: relative;
}

/* Add subtle separator between hero and posts */
.v2-home-page .v2-featured-posts {
  position: relative;
}

.v2-home-page .v2-featured-posts::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--void-color-gray-700),
    transparent
  );
}
```

### 7. Update Route Configuration

Ensure the V2 Home route is properly configured in `packages/config/src/configs/routes/v2.ts`:

```typescript
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
  styles: [...BASE_V2_CSS, "/css/pages/v2-home.css"],
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

- [ ] Hero section displays with gradient text, glowing effects
- [ ] Featured posts grid shows latest 6 posts
- [ ] Post cards have hover effects and proper styling
- [ ] Data fetching uses suspenseful pattern with `use()` API
- [ ] Page prerenders without hanging
- [ ] Responsive layout at all breakpoints
- [ ] Animations respect `prefers-reduced-motion`
- [ ] All links navigate correctly
- [ ] Lighthouse performance score ≥ 90

## Notes

- Hero animations use CSS only (no GSAP for initial load performance)
- Post cards are separate components for reuse in Posts listing page
- Date formatting uses date-fns (already in dependencies)
- Images use lazy loading for performance
- All CSS uses void-tokens for consistency

## Verification

```bash
# Build and prerender
cd apps/web
bun run build

# Check prerendered output
cat dist/v2/index.html | grep -A5 "v2-hero"

# Serve and test
bun run serve
# Navigate to http://localhost:4200/v2
```

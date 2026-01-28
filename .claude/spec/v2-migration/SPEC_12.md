# SPEC-12: V2 Post Detail Page

## Context

This spec implements the V2 Post detail page with rich content rendering, code syntax highlighting, table of contents, reading time estimation, and related posts. This is the primary content consumption experience.

## Prerequisites

- SPEC-01 through SPEC-09 completed (layout and components ready)
- SPEC-11 completed (posts listing for navigation context)
- Single post data fetching hook implemented
- Markdown/MDX rendering configured

## Requirements

### 1. Post Detail Types

Create `apps/web/src/components/v2/PostDetail/types.ts`:

```typescript
import type { UseQueryResult } from "@tanstack/react-query";
import type { Post } from "@/types/Post";

export interface V2PostDetailViewProps {
  queries: [PostQuery, RelatedPostsQuery];
}

export type PostQuery = UseQueryResult<Post, Error>;
export type RelatedPostsQuery = UseQueryResult<Post[], Error>;

export interface PostHeaderProps {
  post: Post;
  readingTime: number;
}

export interface PostContentProps {
  content: string;
}

export interface TableOfContentsProps {
  headings: HeadingItem[];
  activeId: string | null;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export interface RelatedPostsProps {
  posts: Post[];
}

export interface PostNavigationProps {
  previousPost?: Post;
  nextPost?: Post;
}
```

### 2. Post Header Component

Create `apps/web/src/components/v2/PostDetail/components/PostHeader/View.tsx`:

```tsx
import { memo } from "react";
import { Link } from "react-router";
import { format } from "date-fns";

import { pipeline } from "@/utils/pipeline";
import type { PostHeaderProps } from "../../types";

function PostHeaderView({ post, readingTime }: PostHeaderProps) {
  const formattedDate = format(new Date(post.date), "MMMM d, yyyy");

  return (
    <header className="v2-post-header">
      {/* Breadcrumb */}
      <nav className="v2-post-header__breadcrumb" aria-label="Breadcrumb">
        <Link to="/posts" className="v2-post-header__breadcrumb-link">
          Posts
        </Link>
        <span className="v2-post-header__breadcrumb-separator" aria-hidden="true">
          /
        </span>
        <span className="v2-post-header__breadcrumb-current" aria-current="page">
          {post.title}
        </span>
      </nav>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="v2-post-header__tags">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/posts?tag=${encodeURIComponent(tag)}`}
              className="v2-post-header__tag"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="v2-post-header__title">{post.title}</h1>

      {/* Description */}
      {post.description && (
        <p className="v2-post-header__description">{post.description}</p>
      )}

      {/* Meta */}
      <div className="v2-post-header__meta">
        {post.author && (
          <div className="v2-post-header__author">
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt=""
                className="v2-post-header__author-avatar"
              />
            )}
            <span className="v2-post-header__author-name">{post.author.name}</span>
          </div>
        )}
        <time className="v2-post-header__date" dateTime={post.date}>
          {formattedDate}
        </time>
        <span className="v2-post-header__reading-time">
          {readingTime} min read
        </span>
      </div>

      {/* Featured Image */}
      {post.image && (
        <figure className="v2-post-header__image-container">
          <img
            src={post.image}
            alt={post.imageAlt || ""}
            className="v2-post-header__image"
          />
          {post.imageCaption && (
            <figcaption className="v2-post-header__image-caption">
              {post.imageCaption}
            </figcaption>
          )}
        </figure>
      )}
    </header>
  );
}

export default pipeline(memo)(PostHeaderView);
```

### 3. Table of Contents Component

Create `apps/web/src/components/v2/PostDetail/components/TableOfContents/View.tsx`:

```tsx
import { memo } from "react";
import clsx from "clsx";

import { pipeline } from "@/utils/pipeline";
import type { TableOfContentsProps } from "../../types";

function TableOfContentsView({ headings, activeId }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <aside className="v2-toc" aria-labelledby="toc-title">
      <h2 id="toc-title" className="v2-toc__title">
        On this page
      </h2>
      <nav className="v2-toc__nav">
        <ul className="v2-toc__list">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={clsx(
                "v2-toc__item",
                `v2-toc__item--level-${heading.level}`
              )}
            >
              <a
                href={`#${heading.id}`}
                className={clsx(
                  "v2-toc__link",
                  activeId === heading.id && "v2-toc__link--active"
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default pipeline(memo)(TableOfContentsView);
```

### 4. Post Content Component

Create `apps/web/src/components/v2/PostDetail/components/PostContent/View.tsx`:

```tsx
import { memo } from "react";

import { pipeline } from "@/utils/pipeline";
import type { PostContentProps } from "../../types";

function PostContentView({ content }: PostContentProps) {
  return (
    <article
      className="v2-post-content prose"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default pipeline(memo)(PostContentView);
```

### 5. Related Posts Component

Create `apps/web/src/components/v2/PostDetail/components/RelatedPosts/View.tsx`:

```tsx
import { memo } from "react";
import { Link } from "react-router";
import { format } from "date-fns";

import { pipeline } from "@/utils/pipeline";
import type { RelatedPostsProps } from "../../types";

function RelatedPostsView({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="v2-related-posts" aria-labelledby="related-posts-title">
      <h2 id="related-posts-title" className="v2-related-posts__title">
        Related Posts
      </h2>
      <div className="v2-related-posts__grid">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/post/${post.id}`}
            className="v2-related-posts__card"
          >
            {post.image && (
              <img
                src={post.image}
                alt=""
                className="v2-related-posts__image"
                loading="lazy"
              />
            )}
            <div className="v2-related-posts__content">
              <h3 className="v2-related-posts__card-title">{post.title}</h3>
              <time
                className="v2-related-posts__date"
                dateTime={post.date}
              >
                {format(new Date(post.date), "MMM d, yyyy")}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default pipeline(memo)(RelatedPostsView);
```

### 6. Post Detail View Component

Create `apps/web/src/components/v2/PostDetail/View.tsx`:

```tsx
import { memo, use, useState, useEffect, useMemo } from "react";

import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";
import PostHeaderView from "./components/PostHeader/View";
import TableOfContentsView from "./components/TableOfContents/View";
import PostContentView from "./components/PostContent/View";
import RelatedPostsView from "./components/RelatedPosts/View";
import type { V2PostDetailViewProps, HeadingItem } from "./types";

const WORDS_PER_MINUTE = 200;

function calculateReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function extractHeadings(content: string): HeadingItem[] {
  const headingRegex = /<h([2-4])[^>]*id="([^"]+)"[^>]*>([^<]+)<\/h[2-4]>/gi;
  const headings: HeadingItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      id: match[2],
      text: match[3].trim(),
    });
  }

  return headings;
}

function V2PostDetailView({ queries }: V2PostDetailViewProps) {
  const [postQuery, relatedPostsQuery] = queries;
  const post = use(postQuery.promise);
  const relatedPosts = use(relatedPostsQuery.promise);

  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  const readingTime = useMemo(
    () => calculateReadingTime(post.content || ""),
    [post.content]
  );

  const headings = useMemo(
    () => extractHeadings(post.content || ""),
    [post.content]
  );

  // Intersection Observer for active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="v2-post-detail">
      <div className="v2-container">
        <PostHeaderView post={post} readingTime={readingTime} />

        <div className="v2-post-detail__layout">
          {/* Table of Contents - Desktop */}
          <div className="v2-post-detail__sidebar">
            <div className="v2-post-detail__sidebar-sticky">
              <TableOfContentsView
                headings={headings}
                activeId={activeHeadingId}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="v2-post-detail__main">
            <PostContentView content={post.content || ""} />
          </div>
        </div>

        {/* Related Posts */}
        <RelatedPostsView posts={relatedPosts} />
      </div>
    </div>
  );
}

export default pipeline(memo, withProfiler("v2_Post_Detail_View"))(V2PostDetailView);
```

### 7. Post Detail Container

Create `apps/web/src/components/v2/PostDetail/Component.tsx`:

```tsx
import { memo } from "react";
import { useParams } from "react-router";

import { SuspenseEnabledQueryProvider } from "@/components/Base/SEQ";
import { useGetPost, useGetRelatedPosts } from "@/hooks/usePosts";
import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";

import V2PostDetailView from "./View";

function V2PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const postQuery = useGetPost(postId!);
  const relatedPostsQuery = useGetRelatedPosts(postId!);

  return (
    <SuspenseEnabledQueryProvider>
      <V2PostDetailView queries={[postQuery, relatedPostsQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(withProfiler("v2_Post_Detail"), memo)(V2PostDetail);
```

### 8. Post Detail Styles

Create `apps/web/public/css/pages/v2-post-detail.css`:

```css
/**
 * V2 Post Detail Page Styles
 */

.v2-post-detail {
  padding: var(--void-spacing-8) 0 var(--void-spacing-16);
}

/* Header */
.v2-post-header {
  max-width: 800px;
  margin: 0 auto var(--void-spacing-12);
}

.v2-post-header__breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--void-spacing-2);
  margin-bottom: var(--void-spacing-4);
  font-size: 0.875rem;
}

.v2-post-header__breadcrumb-link {
  color: var(--void-color-gray-400);
  text-decoration: none;
  transition: color var(--void-transition-duration-fast);
}

.v2-post-header__breadcrumb-link:hover {
  color: var(--void-color-brand-azure);
}

.v2-post-header__breadcrumb-separator {
  color: var(--void-color-gray-600);
}

.v2-post-header__breadcrumb-current {
  color: var(--void-color-gray-500);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.v2-post-header__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--void-spacing-2);
  margin-bottom: var(--void-spacing-4);
}

.v2-post-header__tag {
  padding: var(--void-spacing-1) var(--void-spacing-3);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--void-color-brand-violet);
  background-color: rgba(139, 92, 246, 0.15);
  border-radius: var(--void-border-radius-full);
  text-decoration: none;
  transition: background-color var(--void-transition-duration-fast);
}

.v2-post-header__tag:hover {
  background-color: rgba(139, 92, 246, 0.25);
}

.v2-post-header__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--void-color-base-white);
  margin-bottom: var(--void-spacing-4);
}

.v2-post-header__description {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--void-color-gray-400);
  margin-bottom: var(--void-spacing-6);
}

.v2-post-header__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--void-spacing-4);
  font-size: 0.875rem;
  color: var(--void-color-gray-500);
  margin-bottom: var(--void-spacing-8);
}

.v2-post-header__author {
  display: flex;
  align-items: center;
  gap: var(--void-spacing-2);
}

.v2-post-header__author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.v2-post-header__author-name {
  color: var(--void-color-gray-300);
  font-weight: 500;
}

.v2-post-header__image-container {
  margin: 0;
  border-radius: var(--void-border-radius-lg);
  overflow: hidden;
}

.v2-post-header__image {
  width: 100%;
  height: auto;
  display: block;
}

.v2-post-header__image-caption {
  padding: var(--void-spacing-3);
  font-size: 0.875rem;
  color: var(--void-color-gray-500);
  text-align: center;
  background-color: var(--void-color-gray-900);
}

/* Layout */
.v2-post-detail__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--void-spacing-8);
  max-width: 800px;
  margin: 0 auto;
}

@media (min-width: 1280px) {
  .v2-post-detail__layout {
    max-width: none;
    grid-template-columns: 240px 1fr;
  }
}

/* Sidebar */
.v2-post-detail__sidebar {
  display: none;
}

@media (min-width: 1280px) {
  .v2-post-detail__sidebar {
    display: block;
  }
}

.v2-post-detail__sidebar-sticky {
  position: sticky;
  top: 100px;
}

/* Table of Contents */
.v2-toc {
  padding: var(--void-spacing-4);
  background-color: var(--void-color-gray-950);
  border: var(--void-border-width-thin) solid var(--void-color-gray-900);
  border-radius: var(--void-border-radius-lg);
}

.v2-toc__title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--void-color-gray-500);
  margin-bottom: var(--void-spacing-3);
}

.v2-toc__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.v2-toc__item {
  margin-bottom: var(--void-spacing-1);
}

.v2-toc__item--level-3 {
  padding-left: var(--void-spacing-3);
}

.v2-toc__item--level-4 {
  padding-left: var(--void-spacing-6);
}

.v2-toc__link {
  display: block;
  padding: var(--void-spacing-1) 0;
  font-size: 0.875rem;
  color: var(--void-color-gray-400);
  text-decoration: none;
  border-left: 2px solid transparent;
  padding-left: var(--void-spacing-3);
  margin-left: calc(var(--void-spacing-3) * -1);
  transition: all var(--void-transition-duration-fast);
}

.v2-toc__link:hover {
  color: var(--void-color-base-white);
}

.v2-toc__link--active {
  color: var(--void-color-brand-violet);
  border-left-color: var(--void-color-brand-violet);
}

/* Main Content */
.v2-post-detail__main {
  max-width: 800px;
}

/* Prose Styles */
.v2-post-content.prose {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--void-color-gray-300);
}

.v2-post-content.prose h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--void-color-base-white);
  margin-top: var(--void-spacing-12);
  margin-bottom: var(--void-spacing-4);
}

.v2-post-content.prose h3 {
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--void-color-base-white);
  margin-top: var(--void-spacing-8);
  margin-bottom: var(--void-spacing-3);
}

.v2-post-content.prose h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--void-color-base-white);
  margin-top: var(--void-spacing-6);
  margin-bottom: var(--void-spacing-2);
}

.v2-post-content.prose p {
  margin-bottom: var(--void-spacing-6);
}

.v2-post-content.prose a {
  color: var(--void-color-brand-azure);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.v2-post-content.prose a:hover {
  color: var(--void-color-brand-violet);
}

.v2-post-content.prose ul,
.v2-post-content.prose ol {
  margin-bottom: var(--void-spacing-6);
  padding-left: var(--void-spacing-6);
}

.v2-post-content.prose li {
  margin-bottom: var(--void-spacing-2);
}

.v2-post-content.prose blockquote {
  border-left: 4px solid var(--void-color-brand-violet);
  padding-left: var(--void-spacing-4);
  margin: var(--void-spacing-6) 0;
  font-style: italic;
  color: var(--void-color-gray-400);
}

.v2-post-content.prose pre {
  background-color: var(--void-color-gray-950);
  border: var(--void-border-width-thin) solid var(--void-color-gray-800);
  border-radius: var(--void-border-radius-lg);
  padding: var(--void-spacing-4);
  overflow-x: auto;
  margin: var(--void-spacing-6) 0;
}

.v2-post-content.prose code {
  font-family: ui-monospace, monospace;
  font-size: 0.875em;
}

.v2-post-content.prose :not(pre) > code {
  background-color: var(--void-color-gray-900);
  padding: 0.125em 0.375em;
  border-radius: var(--void-border-radius-sm);
  color: var(--void-color-brand-azure);
}

.v2-post-content.prose img {
  max-width: 100%;
  height: auto;
  border-radius: var(--void-border-radius-lg);
  margin: var(--void-spacing-6) 0;
}

.v2-post-content.prose hr {
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--void-color-gray-700),
    transparent
  );
  margin: var(--void-spacing-12) 0;
}

/* Related Posts */
.v2-related-posts {
  max-width: 800px;
  margin: var(--void-spacing-16) auto 0;
  padding-top: var(--void-spacing-12);
  border-top: var(--void-border-width-thin) solid var(--void-color-gray-900);
}

.v2-related-posts__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--void-color-base-white);
  margin-bottom: var(--void-spacing-6);
}

.v2-related-posts__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--void-spacing-4);
}

@media (min-width: 640px) {
  .v2-related-posts__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .v2-related-posts__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.v2-related-posts__card {
  display: flex;
  flex-direction: column;
  background-color: var(--void-color-gray-900);
  border: var(--void-border-width-thin) solid var(--void-color-gray-800);
  border-radius: var(--void-border-radius-lg);
  overflow: hidden;
  text-decoration: none;
  transition: border-color var(--void-transition-duration-fast),
    transform var(--void-transition-duration-fast);
}

.v2-related-posts__card:hover {
  border-color: var(--void-color-brand-violet);
  transform: translateY(-2px);
}

.v2-related-posts__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.v2-related-posts__content {
  padding: var(--void-spacing-4);
}

.v2-related-posts__card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--void-color-base-white);
  margin-bottom: var(--void-spacing-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.v2-related-posts__date {
  font-size: 0.75rem;
  color: var(--void-color-gray-500);
}
```

### 9. Component Exports

Create `apps/web/src/components/v2/PostDetail/index.ts`:

```typescript
export { default as V2PostDetail } from "./Component";
export type {
  V2PostDetailViewProps,
  PostHeaderProps,
  PostContentProps,
  TableOfContentsProps,
  HeadingItem,
  RelatedPostsProps,
} from "./types";
```

### 10. Route Configuration

Update route configuration for dynamic post routes:

```typescript
export const V2_PostDetailRouteConfiguration: Readonly<
  RouteConfiguration<"getPost" | "getRelatedPosts", { postId: string }>
> = {
  page: ArcPageEnum.v2_POST_DETAIL,
  type: "dynamic",
  path: {
    [RouteConfigurationPathKeysEnum.Browser]: "/post/:postId",
    [RouteConfigurationPathKeysEnum.Static]: "/v2/post/[postId]/index.html",
  },
  styles: [...BASE_V2_CSS, "/css/pages/v2-post-detail.css"],
  queries: [
    {
      queryKey: ["post", ":postId"],
      queryFnName: "getPost",
      queryFnParams: { postId: ":postId" },
    },
    {
      queryKey: ["relatedPosts", ":postId"],
      queryFnName: "getRelatedPosts",
      queryFnParams: { postId: ":postId" },
    },
  ],
} as const;
```

## Acceptance Criteria

- [ ] Post header displays title, tags, date, author, and image
- [ ] Reading time calculated from content length
- [ ] Table of contents generates from headings
- [ ] Active heading highlights as user scrolls
- [ ] Prose styles render markdown content beautifully
- [ ] Code blocks have syntax highlighting
- [ ] Related posts display at bottom
- [ ] Breadcrumb navigation works correctly
- [ ] Tags link to filtered posts listing
- [ ] Both queries prefetched during prerender
- [ ] Responsive layout at all breakpoints
- [ ] Accessible with proper semantic HTML

## Notes

- Reading time based on 200 WPM average
- TOC visible only on large screens (1280px+)
- Intersection Observer tracks active heading
- Content uses `dangerouslySetInnerHTML` (assume sanitized from backend)
- Related posts determined by matching tags
- Prose class provides consistent typography
- Code highlighting requires separate library (Prism/Shiki)
- Dynamic route requires param extraction from URL

## Verification

```bash
# Build and test
bun run build
bun run serve
# Navigate to http://localhost:4200/post/[postId]
# Verify all content renders
# Test TOC scrollspy on desktop
# Test responsive layout
# Check code block styling
```

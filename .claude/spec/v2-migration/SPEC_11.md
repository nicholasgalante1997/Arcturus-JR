# SPEC-11: V2 Posts Listing Page

## Context

This spec implements the V2 Posts listing page with pagination, filtering by tags, search functionality, and responsive grid layout. This page displays all blog posts in a clean, browsable format.

## Prerequisites

- SPEC-01 through SPEC-09 completed (layout and components ready)
- SPEC-10 completed (PostCardV2 component reusable)
- Posts data fetching hooks implemented
- TanStack Query configured

## Requirements

### 1. Posts Page Types

Create `apps/web/src/components/v2/Posts/types.ts`:

```typescript
import type { UseQueryResult } from "@tanstack/react-query";
import type { Post } from "@/types/Post";

export interface V2PostsPageViewProps {
  queries: [PostsQuery];
}

export type PostsQuery = UseQueryResult<Post[], Error>;

export interface PostsGridProps {
  posts: Post[];
}

export interface PostsFilterProps {
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  availableTags: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

### 2. Posts Filter Component

Create `apps/web/src/components/v2/Posts/components/PostsFilter/View.tsx`:

```tsx
import { memo } from "react";
import clsx from "clsx";

import { Input } from "@arcjr/void-components";
import { pipeline } from "@/utils/pipeline";
import type { PostsFilterProps } from "../../types";

function PostsFilterView({
  selectedTag,
  onTagSelect,
  availableTags,
  searchQuery,
  onSearchChange,
}: PostsFilterProps) {
  return (
    <div className="v2-posts-filter">
      {/* Search */}
      <div className="v2-posts-filter__search">
        <Input
          type="search"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
          leftElement={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M7 12a5 5 0 100-10 5 5 0 000 10zM14 14l-3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>

      {/* Tags */}
      <div className="v2-posts-filter__tags">
        <button
          type="button"
          className={clsx(
            "v2-posts-filter__tag",
            !selectedTag && "v2-posts-filter__tag--active"
          )}
          onClick={() => onTagSelect(null)}
        >
          All Posts
        </button>
        {availableTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={clsx(
              "v2-posts-filter__tag",
              selectedTag === tag && "v2-posts-filter__tag--active"
            )}
            onClick={() => onTagSelect(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default pipeline(memo)(PostsFilterView);
```

### 3. Pagination Component

Create `apps/web/src/components/v2/Posts/components/Pagination/View.tsx`:

```tsx
import { memo } from "react";
import clsx from "clsx";

import { pipeline } from "@/utils/pipeline";
import type { PaginationProps } from "../../types";

function PaginationView({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="v2-pagination" aria-label="Pagination">
      <button
        type="button"
        className="v2-pagination__button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="v2-pagination__pages">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={clsx(
              "v2-pagination__page",
              currentPage === page && "v2-pagination__page--active"
            )}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="v2-pagination__button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
}

export default pipeline(memo)(PaginationView);
```

### 4. Posts Grid Component

Create `apps/web/src/components/v2/Posts/components/PostsGrid/View.tsx`:

```tsx
import { memo } from "react";

import { PostCardV2 } from "@/components/v2/Home/components/FeaturedPosts";
import { pipeline } from "@/utils/pipeline";
import type { PostsGridProps } from "../../types";

function PostsGridView({ posts }: PostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="v2-posts-empty">
        <svg
          className="v2-posts-empty__icon"
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
        >
          <path
            d="M20 20h24M20 28h16M20 36h20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect
            x="12"
            y="12"
            width="40"
            height="40"
            rx="4"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <h3 className="v2-posts-empty__title">No posts found</h3>
        <p className="v2-posts-empty__description">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="v2-posts-grid">
      {posts.map((post) => (
        <PostCardV2 key={post.id} post={post} />
      ))}
    </div>
  );
}

export default pipeline(memo)(PostsGridView);
```

### 5. Posts Page View Component

Create `apps/web/src/components/v2/Posts/View.tsx`:

```tsx
import { useState, useMemo, memo, use } from "react";

import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";
import PostsFilterView from "./components/PostsFilter/View";
import PostsGridView from "./components/PostsGrid/View";
import PaginationView from "./components/Pagination/View";
import type { V2PostsPageViewProps } from "./types";

const POSTS_PER_PAGE = 9;

function V2PostsPageView({ queries }: V2PostsPageViewProps) {
  const [postsQuery] = queries;
  const allPosts = use(postsQuery.promise);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique tags from all posts
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach((post) => {
      post.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      // Filter by tag
      if (selectedTag && !post.tags?.includes(selectedTag)) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.description?.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [allPosts, selectedTag, searchQuery]);

  // Paginate posts
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    return filteredPosts.slice(start, end);
  }, [filteredPosts, currentPage]);

  // Reset to page 1 when filters change
  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="v2-posts-page">
      <div className="v2-container">
        {/* Header */}
        <header className="v2-posts-page__header">
          <h1 className="v2-posts-page__title">Blog Posts</h1>
          <p className="v2-posts-page__description">
            Exploring software architecture, distributed systems, and modern web
            development
          </p>
        </header>

        {/* Filters */}
        <PostsFilterView
          selectedTag={selectedTag}
          onTagSelect={handleTagSelect}
          availableTags={availableTags}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Results count */}
        <div className="v2-posts-page__results">
          <p className="v2-posts-page__count">
            {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
            {selectedTag && ` tagged with "${selectedTag}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Posts Grid */}
        <PostsGridView posts={paginatedPosts} />

        {/* Pagination */}
        <PaginationView
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default pipeline(memo, withProfiler("v2_Posts_Page_View"))(V2PostsPageView);
```

### 6. Posts Page Container

Create `apps/web/src/components/v2/Posts/Component.tsx`:

```tsx
import { memo } from "react";

import { SuspenseEnabledQueryProvider } from "@/components/Base/SEQ";
import { useGetPosts } from "@/hooks/usePosts";
import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";

import V2PostsPageView from "./View";

function V2PostsPage() {
  const postsQuery = useGetPosts();

  return (
    <SuspenseEnabledQueryProvider>
      <V2PostsPageView queries={[postsQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(withProfiler("v2_Posts_Page"), memo)(V2PostsPage);
```

### 7. Posts Page Styles

Create `apps/web/public/css/pages/v2-posts.css`:

```css
/**
 * V2 Posts Page Styles
 */

.v2-posts-page {
  padding: var(--void-spacing-8) 0 var(--void-spacing-16);
}

/* Header */
.v2-posts-page__header {
  text-align: center;
  margin-bottom: var(--void-spacing-12);
}

.v2-posts-page__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--void-color-base-white);
  margin-bottom: var(--void-spacing-4);
}

.v2-posts-page__description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--void-color-gray-400);
  max-width: 600px;
  margin: 0 auto;
}

/* Filter */
.v2-posts-filter {
  display: flex;
  flex-direction: column;
  gap: var(--void-spacing-4);
  margin-bottom: var(--void-spacing-8);
}

.v2-posts-filter__search {
  max-width: 400px;
}

.v2-posts-filter__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--void-spacing-2);
}

.v2-posts-filter__tag {
  padding: var(--void-spacing-2) var(--void-spacing-4);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--void-color-gray-400);
  background-color: var(--void-color-gray-900);
  border: var(--void-border-width-thin) solid var(--void-color-gray-800);
  border-radius: var(--void-border-radius-full);
  cursor: pointer;
  transition: all var(--void-transition-duration-fast)
    var(--void-transition-easing-ease);
}

.v2-posts-filter__tag:hover {
  color: var(--void-color-base-white);
  border-color: var(--void-color-gray-700);
}

.v2-posts-filter__tag--active {
  color: var(--void-color-base-white);
  background-color: var(--void-color-brand-violet);
  border-color: var(--void-color-brand-violet);
}

/* Results */
.v2-posts-page__results {
  margin-bottom: var(--void-spacing-6);
}

.v2-posts-page__count {
  font-size: 0.875rem;
  color: var(--void-color-gray-500);
  margin: 0;
}

/* Grid */
.v2-posts-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--void-spacing-6);
  margin-bottom: var(--void-spacing-12);
}

@media (min-width: 640px) {
  .v2-posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .v2-posts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Empty State */
.v2-posts-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--void-spacing-16) var(--void-spacing-4);
  text-align: center;
}

.v2-posts-empty__icon {
  color: var(--void-color-gray-700);
  margin-bottom: var(--void-spacing-4);
}

.v2-posts-empty__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--void-color-gray-300);
  margin-bottom: var(--void-spacing-2);
}

.v2-posts-empty__description {
  font-size: 1rem;
  color: var(--void-color-gray-500);
  margin: 0;
}

/* Pagination */
.v2-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--void-spacing-2);
}

.v2-pagination__button,
.v2-pagination__page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 var(--void-spacing-2);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--void-color-gray-400);
  background-color: var(--void-color-gray-900);
  border: var(--void-border-width-thin) solid var(--void-color-gray-800);
  border-radius: var(--void-border-radius-md);
  cursor: pointer;
  transition: all var(--void-transition-duration-fast)
    var(--void-transition-easing-ease);
}

.v2-pagination__button:hover:not(:disabled),
.v2-pagination__page:hover {
  color: var(--void-color-base-white);
  border-color: var(--void-color-gray-700);
}

.v2-pagination__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.v2-pagination__page--active {
  color: var(--void-color-base-white);
  background-color: var(--void-color-brand-violet);
  border-color: var(--void-color-brand-violet);
}

.v2-pagination__pages {
  display: flex;
  gap: var(--void-spacing-1);
}
```

### 8. Component Exports

Create `apps/web/src/components/v2/Posts/index.ts`:

```typescript
export { default as V2PostsPage } from "./Component";
export type {
  V2PostsPageViewProps,
  PostsGridProps,
  PostsFilterProps,
  PaginationProps,
} from "./types";
```

## Acceptance Criteria

- [ ] Posts display in responsive grid (1/2/3 columns)
- [ ] Search filters posts by title, description, and tags
- [ ] Tag filtering works correctly
- [ ] Pagination shows 9 posts per page
- [ ] Page resets to 1 when filters change
- [ ] Empty state displays when no posts match
- [ ] All posts data fetched and prefetched during prerender
- [ ] Suspenseful rendering with `use()` API
- [ ] Accessible with proper ARIA labels
- [ ] Responsive at all breakpoints

## Notes

- Reuses PostCardV2 from SPEC-10 for consistency
- Client-side filtering for instant UX
- Search is case-insensitive
- Tags extracted dynamically from posts
- Pagination hidden when only 1 page
- Filter state resets pagination to prevent empty pages
- useMemo optimizations for filter/pagination calculations

## Verification

```bash
# Build and test
bun run build
bun run serve
# Navigate to http://localhost:4200/posts
# Test search functionality
# Test tag filtering
# Test pagination
# Verify responsive layout
```

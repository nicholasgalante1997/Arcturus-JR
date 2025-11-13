import { memo, use, useMemo, useState } from 'react';

import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import { PaginationView } from './components/Pagination';
import { PostsFilterView } from './components/PostsFilter';
import { PostsGridView } from './components/PostsGrid';

import type { V2PostsPageViewProps } from './types';

const POSTS_PER_PAGE = 9;
const subtitle = '<!--placeholder-->';
const SHOW_SUBTITLE = false;

function V2PostsPageView({ queries }: V2PostsPageViewProps) {
  const [postsQuery] = queries;
  const allPosts = use(postsQuery.promise);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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
          post.excerpt?.toLowerCase().includes(query) ||
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
  const handleTagSelect = (tag: string | null): void => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string): void => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="v2-posts-page">
      <div className="container">
        {/* Header */}
        <header className="v2-posts-page__header">
          <h1 className="v2-posts-page__title">Blog Posts</h1>
          {SHOW_SUBTITLE && <p className="v2-posts-page__description">{subtitle}</p>}
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
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            {selectedTag && ` tagged with "${selectedTag}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Posts Grid */}
        <PostsGridView posts={paginatedPosts} />

        {/* Pagination */}
        <PaginationView currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

export default pipeline(memo, withProfiler('v2_Posts_Page_View'))(V2PostsPageView);

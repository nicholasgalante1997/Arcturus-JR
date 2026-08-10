import { memo, use, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import copy from '@/content/en.json';
import { formatMessage } from '@/utils/formatMessage';
import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import { PostsGridView } from './components/PostsGrid';
import { filterPosts } from './filterPosts';

import type { V2PostsPageViewProps } from './types';

function V2PostsPageView({ queries }: V2PostsPageViewProps) {
  const [postsQuery] = queries;
  const allPosts = use(postsQuery.promise);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';
  const normalizedQuery = searchQuery.trim();

  const filteredPosts = useMemo(
    () => filterPosts(allPosts, normalizedQuery),
    [allPosts, normalizedQuery]
  );

  const updateSearch = (query: string): void => {
    const nextParams = new URLSearchParams(searchParams);
    if (query) nextParams.set('q', query);
    else nextParams.delete('q');
    setSearchParams(nextParams, { replace: true });
  };

  const resultMessage =
    filteredPosts.length === 1 ? copy.posts.resultCountOne : copy.posts.resultCountMany;

  return (
    <div className="v2-posts-page">
      <div className="wrapper">
        <header className="v2-posts-page__header">
          <div className="v2-posts-page__introduction">
            <h1 className="v2-visually-hidden">Posts</h1>
            <p>{copy.posts.intro}</p>
          </div>
          <div className="v2-posts-search">
            <label className="v2-visually-hidden" htmlFor="posts-search">
              {copy.posts.searchLabel}
            </label>
            <svg
              className="v2-posts-search__icon"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="7.75" cy="7.75" r="5.25" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="m11.5 11.5 4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              id="posts-search"
              type="search"
              value={searchQuery}
              placeholder={copy.posts.searchPlaceholder}
              className="v2-posts-search__input"
              onChange={(event) => updateSearch(event.target.value)}
            />
          </div>
        </header>

        {normalizedQuery && filteredPosts.length > 0 && (
          <p className="v2-posts-page__count" aria-live="polite">
            {formatMessage(resultMessage, {
              count: filteredPosts.length,
              query: normalizedQuery
            })}
          </p>
        )}

        {filteredPosts.length > 0 ? (
          <PostsGridView posts={filteredPosts} />
        ) : (
          <div className="v2-posts-empty" aria-live="polite">
            <p>{formatMessage(copy.posts.noResults, { query: normalizedQuery })}</p>
            <button type="button" onClick={() => updateSearch('')}>
              {copy.posts.clearSearch}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default pipeline(memo, withProfiler('v2_Posts_Page_View'))(V2PostsPageView);

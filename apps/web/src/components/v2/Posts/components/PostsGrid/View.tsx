import { memo } from 'react';

import { PostCardV2 } from '@/components/v2/Home/components/FeaturedPosts';
import { pipeline } from '@/utils/pipeline';

import type { PostsGridProps } from '../../types';

function PostsGridView({ posts }: PostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="v2-posts-empty">
        <svg className="v2-posts-empty__icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path d="M20 20h24M20 28h16M20 36h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="12" y="12" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="2" />
        </svg>
        <h3 className="v2-posts-empty__title">No posts found</h3>
        <p className="v2-posts-empty__description">Try adjusting your filters or search query</p>
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

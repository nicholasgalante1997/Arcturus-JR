import { memo } from 'react';

import { pipeline } from '@/utils/pipeline';

import { ArchivePostRow } from '../ArchivePostRow';

import type { PostsGridProps } from '../../types';

function PostsGridView({ posts }: PostsGridProps) {
  return (
    <div className="v2-posts-grid">
      {posts.map((post, index) => (
        <ArchivePostRow key={post.id} post={post} prioritizeImage={index === 0} />
      ))}
    </div>
  );
}

export default pipeline(memo)(PostsGridView);

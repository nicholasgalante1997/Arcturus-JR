import React from 'react';
import { PostCard } from '../Card';
import { PostCardListProps } from './types';

function PostCardList({ posts }: PostCardListProps) {
  return (
    <div className="post-list" id="recent-posts">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default React.memo(PostCardList);

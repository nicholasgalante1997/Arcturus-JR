import React from 'react';
import { PostCardProps } from './types';

function PostCard({ post }: PostCardProps) {
  return (
    <div className="post-card">
      <a href={`/post/${post.id}`} data-link>
        <div className="post-card-content">
          <h2>{post.title}</h2>
          <div className="post-meta">
            <time dateTime={`${post.date}`}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          <p className="post-excerpt">{post.excerpt}</p>
        </div>
      </a>
    </div>
  );
}

export default React.memo(PostCard);

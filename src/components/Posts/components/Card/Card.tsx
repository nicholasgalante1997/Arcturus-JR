import React from 'react';
import { Link } from 'react-router';

import { PostCardProps } from './types';

function PostCard({ post }: PostCardProps) {
  return (
    <div className="post-card">
      <Link to={`/post/${post.id}`}>
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
      </Link>
    </div>
  );
}

export default React.memo(PostCard);

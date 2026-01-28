import { format } from 'date-fns';
import { memo } from 'react';
import { Link } from 'react-router';

import { pipeline } from '@/utils/pipeline';

import type { RelatedPostsProps } from '../../types';

function RelatedPostsView({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="v2-related-posts" aria-labelledby="related-posts-title">
      <h2 id="related-posts-title" className="v2-related-posts__title">
        Related Posts
      </h2>
      <div className="v2-related-posts__grid">
        {posts.map((post) => (
          <Link key={post.id} to={`/v2/post/${post.id}`} className="v2-related-posts__card">
            {post.image && (
              <img
                src={post.image.src}
                alt={post.image.alt || ''}
                className="v2-related-posts__image"
                loading="lazy"
              />
            )}
            <div className="v2-related-posts__content">
              <h3 className="v2-related-posts__card-title">{post.title}</h3>
              <time className="v2-related-posts__date" dateTime={post.date}>
                {format(new Date(post.date), 'MMM d, yyyy')}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default pipeline(memo)(RelatedPostsView);

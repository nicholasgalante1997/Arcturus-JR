import { formatDistanceToNow } from 'date-fns';
import { memo } from 'react';
import { Link } from 'react-router';

import { pipeline } from '@/utils/pipeline';

import type { PostCardV2Props } from '../../types';

function PostCardV2View({ post }: PostCardV2Props) {
  const formattedDate = formatDistanceToNow(new Date(post.date), {
    addSuffix: true
  });

  return (
    <article className="v2-post-card">
      {post.image && (
        <Link
          to={`/post/${post.slug}`}
          className="v2-post-card__image-link"
          aria-label={`Read ${post.title}`}
          tabIndex={-1}
        >
          <div className="v2-post-card__image-container">
            <img
              src={post.image.src}
              alt={post.image.alt || post.title}
              className="v2-post-card__image"
              loading="lazy"
            />
            <div className="v2-post-card__image-overlay" />
          </div>
        </Link>
      )}
      <div className="v2-post-card__content">
        <div className="v2-post-card__meta">
          {post.tags && post.tags.length > 0 && <span className="v2-post-card__tag">{post.tags[0]}</span>}
          <time className="v2-post-card__date" dateTime={post.date}>
            {formattedDate}
          </time>
        </div>
        <h3 className="v2-post-card__title">
          <Link to={`/post/${post.slug}`} className="v2-post-card__title-link">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="v2-post-card__description">{post.excerpt}</p>}
      </div>
    </article>
  );
}

export default pipeline(memo)(PostCardV2View);

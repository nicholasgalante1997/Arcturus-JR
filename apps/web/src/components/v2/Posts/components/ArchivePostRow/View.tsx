import { memo } from 'react';
import { Link } from 'react-router';

import { pipeline } from '@/utils/pipeline';
import { formatPostCategory, formatPostDate } from '@/utils/postPresentation';

import type { ArchivePostRowProps } from '../../types';

function ArchivePostRowView({ post, prioritizeImage = false }: ArchivePostRowProps) {
  return (
    <article className="v2-archive-post">
      <div className="v2-archive-post__content">
        <div className="v2-archive-post__meta">
          <span>{formatPostCategory(post.category)}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        </div>
        <h2 className="v2-archive-post__title">
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="v2-archive-post__excerpt">{post.excerpt}</p>
        <p className="v2-archive-post__reading-time">{post.readingTime}</p>
      </div>
      <Link
        to={`/post/${post.slug}`}
        className="v2-archive-post__image-link"
        aria-label={`Read ${post.title}`}
        tabIndex={-1}
      >
        <img
          src={post.image.src}
          alt={post.image.alt}
          className="v2-archive-post__image"
          loading={prioritizeImage ? 'eager' : 'lazy'}
          fetchPriority={prioritizeImage ? 'high' : 'auto'}
        />
      </Link>
    </article>
  );
}

export default pipeline(memo)(ArchivePostRowView);

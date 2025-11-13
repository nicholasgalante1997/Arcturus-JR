import { format } from 'date-fns';
import { memo } from 'react';
import { Link } from 'react-router';

import { pipeline } from '@/utils/pipeline';

import type { PostHeaderProps } from '../../types';

function PostHeaderView({ post, readingTime }: PostHeaderProps) {
  const formattedDate = format(new Date(post.date), 'MMMM d, yyyy');

  return (
    <header className="v2-post-header">
      {/* Breadcrumb */}
      <nav className="v2-post-header__breadcrumb" aria-label="Breadcrumb">
        <Link to="/v2/posts" className="v2-post-header__breadcrumb-link">
          Posts
        </Link>
        <span className="v2-post-header__breadcrumb-separator" aria-hidden="true">
          /
        </span>
        <span className="v2-post-header__breadcrumb-current" aria-current="page">
          {post.title}
        </span>
      </nav>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="v2-post-header__tags">
          {post.tags.map((tag) => (
            <Link key={tag} to={`/v2/posts?tag=${encodeURIComponent(tag)}`} className="v2-post-header__tag">
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="v2-post-header__title">{post.title}</h1>

      {/* Description */}
      {post.excerpt && <p className="v2-post-header__description">{post.excerpt}</p>}

      {/* Meta */}
      <div className="v2-post-header__meta">
        <time className="v2-post-header__date" dateTime={post.date}>
          {formattedDate}
        </time>
        <span className="v2-post-header__reading-time">{readingTime} min read</span>
      </div>

      {/* Featured Image */}
      {post.image && (
        <figure className="v2-post-header__image-container">
          <img src={post.image.src} alt={post.image.alt || ''} className="v2-post-header__image" />
        </figure>
      )}
    </header>
  );
}

export default pipeline(memo)(PostHeaderView);

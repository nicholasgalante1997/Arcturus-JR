import React, { memo } from 'react';
import { Link } from 'react-router';

import { pipeline } from '@/utils/pipeline';
import { formatPostCategory, formatPostDate } from '@/utils/postPresentation';

import type { FeaturedPostsProps } from './types';

function PostMeta({ post }: { post: NonNullable<FeaturedPostsProps['featuredPost']> }) {
  return (
    <div className="v2-home-post-meta">
      <span>{formatPostCategory(post.category)}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readingTime}</span>
    </div>
  );
}

function FeaturedPostsView({ featuredPost, recentPosts }: FeaturedPostsProps) {
  if (!featuredPost) return null;

  return (
    <section className="v2-home-editorial" aria-label="Selected writing">
      <article className="v2-home-feature">
        <Link
          to={`/post/${featuredPost.slug}`}
          className="v2-home-feature__image-link"
          aria-label={`Read ${featuredPost.title}`}
          tabIndex={-1}
        >
          <img
            src={featuredPost.image.src}
            alt={featuredPost.image.alt}
            className="v2-home-feature__image"
          />
        </Link>
        <div className="v2-home-feature__content">
          <PostMeta post={featuredPost} />
          <h2 className="v2-home-feature__title">
            <Link to={`/post/${featuredPost.slug}`}>{featuredPost.title}</Link>
          </h2>
          <p className="v2-home-feature__excerpt">{featuredPost.excerpt}</p>
        </div>
      </article>

      {recentPosts.length > 0 && (
        <div className="v2-home-recent">
          <h2 className="v2-home-recent__heading">Recent writing</h2>
          <div className="v2-home-recent__grid">
            {recentPosts.map((post) => (
              <article className="v2-home-recent-post" key={post.id}>
                <div className="v2-home-recent-post__content">
                  <PostMeta post={post} />
                  <h3 className="v2-home-recent-post__title">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="v2-home-recent-post__excerpt">{post.excerpt}</p>
                </div>
                <Link
                  to={`/post/${post.slug}`}
                  className="v2-home-recent-post__image-link"
                  aria-label={`Read ${post.title}`}
                  tabIndex={-1}
                >
                  <img
                    src={post.image.src}
                    alt={post.image.alt}
                    className="v2-home-recent-post__image"
                    loading="lazy"
                  />
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default pipeline(memo)(FeaturedPostsView);

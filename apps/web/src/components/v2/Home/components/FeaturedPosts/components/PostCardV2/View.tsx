import { formatDistanceToNow } from "date-fns";
import React, { memo } from "react";
import { Link } from "react-router";

import { pipeline } from "@/utils/pipeline";

import type { PostCardV2Props } from "../../types";

function PostCardV2View({ post }: PostCardV2Props) {
  const formattedDate = formatDistanceToNow(new Date(post.date), {
    addSuffix: true,
  });

  return (
    <article className="v2-post-card">
      <Link to={`/v2/post/${post.slug}`} className="v2-post-card__link">
        {post.image && (
          <div className="v2-post-card__image-container">
            <img
              src={post.image.src}
              alt={post.image.alt || post.title}
              className="v2-post-card__image"
              loading="lazy"
            />
            <div className="v2-post-card__image-overlay" />
          </div>
        )}
        <div className="v2-post-card__content">
          <div className="v2-post-card__meta">
            {post.tags && post.tags.length > 0 && (
              <span className="v2-post-card__tag">{post.tags[0]}</span>
            )}
            <time className="v2-post-card__date" dateTime={post.date}>
              {formattedDate}
            </time>
          </div>
          <h3 className="v2-post-card__title">{post.title}</h3>
          {post.excerpt && (
            <p className="v2-post-card__description">{post.excerpt}</p>
          )}
          <span className="v2-post-card__read-more">
            Read more
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10m0 0L9 4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default pipeline(memo)(PostCardV2View);
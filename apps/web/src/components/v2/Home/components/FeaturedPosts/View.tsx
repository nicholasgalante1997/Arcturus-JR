import React, { memo } from "react";
import { Link } from "react-router";

import { pipeline } from "@/utils/pipeline";

import { PostCardV2 } from "./components/PostCardV2";

import type { FeaturedPostsProps } from "./types";

function FeaturedPostsView({ posts, limit = 6 }: FeaturedPostsProps) {
  const displayPosts = posts.slice(0, limit);

  return (
    <section className="v2-featured-posts" aria-labelledby="featured-posts-title">
      <header className="v2-featured-posts__header">
        <h2 id="featured-posts-title" className="v2-featured-posts__title">
          Latest Posts
        </h2>
        <Link to="/posts" className="v2-featured-posts__view-all">
          View all posts
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
        </Link>
      </header>
      <div className="v2-featured-posts__grid">
        {displayPosts.map((post) => (
          <PostCardV2 key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default pipeline(memo)(FeaturedPostsView);

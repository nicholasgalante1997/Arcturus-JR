import React, { memo, use } from 'react';

import { Markdown } from '@/components/Base/Markdown';
import { PostCardsList } from '@/components/Posts/components/List';
import { pipeline } from '@/utils/pipeline';

import { HomeViewProps } from './types';

function ArchiveBanner() {
  return (
    <div className="v2-launch-banner">
      <div className="v2-launch-banner__content">
        <span className="v2-launch-banner__badge">Archive</span>
        <p className="v2-launch-banner__text">
          You&apos;re viewing the archived v1 site. The latest version has a fresh design and all the same
          content.
        </p>
        <a href="/" className="v2-launch-banner__link">
          Visit the latest site
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function HomeView({ queries }: HomeViewProps) {
  const [_markdown, _posts] = queries;
  const markdown = use(_markdown.promise);
  const posts = use(_posts.promise);
  return (
    <React.Fragment>
      <ArchiveBanner />
      <div className="markdown-content">
        <Markdown markdown={markdown.markdown} />
      </div>
      <h2 className="recent-posts-label">Recent Posts</h2>
      <PostCardsList posts={posts.slice(0, 3)} />
    </React.Fragment>
  );
}

export default pipeline(memo)(HomeView) as React.MemoExoticComponent<React.ComponentType<HomeViewProps>>;

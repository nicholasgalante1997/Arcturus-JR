import React, { memo } from 'react';

import { Markdown } from '@/components/Base/Markdown';
import { PostCardsList } from '@/components/Posts/components/List';
import { pipeline } from '@/utils/pipeline';

import { HomeViewProps } from './types';

function HomeView({ markdown, posts }: HomeViewProps) {
  return (
    <React.Fragment>
      <div className="markdown-content">
        <Markdown markdown={markdown} />
      </div>
      <h2 className="recent-posts-label">Recent Posts</h2>
      <PostCardsList posts={posts} />
    </React.Fragment>
  );
}

export default pipeline(memo)(HomeView) as React.MemoExoticComponent<React.ComponentType<HomeViewProps>>;

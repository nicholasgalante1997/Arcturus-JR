import React, { memo, use } from 'react';

import { Markdown } from '@/components/Base/Markdown';
import { PostCardsList } from '@/components/Posts/components/List';
import { pipeline } from '@/utils/pipeline';

import { HomeViewProps } from './types';

function HomeView({ queries }: HomeViewProps) {
  const [_markdown, _posts] = queries;
  const markdown = use(_markdown.promise);
  const posts = use(_posts.promise);
  return (
    <React.Fragment>
      <div className="markdown-content">
        <Markdown markdown={markdown.markdown} />
      </div>
      <h2 className="recent-posts-label">Recent Posts</h2>
      <PostCardsList posts={posts.slice(0, 3)} />
    </React.Fragment>
  );
}

export default pipeline(memo)(HomeView) as React.MemoExoticComponent<React.ComponentType<HomeViewProps>>;

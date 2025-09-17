import React from 'react';

import { DQUI } from '@/components/DeferredQueryUI';
import { Markdown } from '@/components/Markdown';
import { PostCardsList } from '@/components/Posts/components/List';
import { useMarkdown } from '@/hooks/useMarkdown';
import { useGetPosts } from '@/hooks/usePosts';

function Home() {
  const $md = useMarkdown('/content/home.md');
  const $posts = useGetPosts();
  return (
    <React.Fragment>
      <DQUI q={$md}>
        <div className="markdown-content">
          <Markdown markdown={$md.data?.markdown || ''} />
        </div>
      </DQUI>
      <DQUI q={$posts}>
        <h2 className="recent-posts-label">Recent Posts</h2>
        <PostCardsList posts={$posts.data || []} />
      </DQUI>
    </React.Fragment>
  );
}

export default React.memo(Home);

import React from 'react';

import { DQUI } from '@/components/Base/DeferredQueryUI';
import { useMarkdown } from '@/hooks/useMarkdown';
import { useGetPosts } from '@/hooks/usePosts';
import { pipeline } from '@/utils/pipeline';

import HomeView from './View';

function Home() {
  const $md = useMarkdown('/content/home.md');
  const $posts = useGetPosts();
  return (
    <React.Fragment>
      <DQUI q={$md}>
        <DQUI q={$posts}>
          <HomeView markdown={$md.data?.markdown || ''} posts={$posts.data || []} />
        </DQUI>
      </DQUI>
    </React.Fragment>
  );
}

export default pipeline(React.memo)(Home);

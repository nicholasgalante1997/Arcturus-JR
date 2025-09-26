import React from 'react';

import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useMarkdown } from '@/hooks/useMarkdown';
import { useGetPosts } from '@/hooks/usePosts';
import { pipeline } from '@/utils/pipeline';

import HomeView from './View';

function Home() {
  const markdown = useMarkdown('/content/home.md');
  const posts = useGetPosts();
  return (
    <SuspenseEnabledQueryProvider>
      <HomeView queries={[markdown, posts]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(React.memo)(Home);

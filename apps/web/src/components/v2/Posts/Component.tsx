import { memo } from 'react';

import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useGetPosts } from '@/hooks/usePosts';
import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import V2PostsPageView from './View';

function V2PostsPage() {
  const postsQuery = useGetPosts();

  return (
    <SuspenseEnabledQueryProvider>
      <V2PostsPageView queries={[postsQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(withProfiler('v2_Posts_Page'), memo)(V2PostsPage);

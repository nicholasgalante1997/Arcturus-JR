import React, { memo } from 'react';

import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useGetPosts } from '@/hooks/usePosts';
import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import V2HomePageView from './View';

function V2HomePage() {
  const postsQuery = useGetPosts();

  return (
    <SuspenseEnabledQueryProvider>
      <V2HomePageView queries={[postsQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(withProfiler('v2_Home_Page'), memo)(V2HomePage);

import React, { memo } from 'react';

import { SuspenseEnabledQueryProvider } from '@/components/Base';
import { useGetPosts } from '@/hooks/usePosts';
import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import V2PostsGridView from './View';

function V2PostGridComponent() {
  const postsQuery = useGetPosts();
  return (
    <SuspenseEnabledQueryProvider>
      <V2PostsGridView queries={[postsQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(
  memo,
  withProfiler('v2_Post_Grid_Component')
)(V2PostGridComponent) as React.MemoExoticComponent<typeof V2PostGridComponent>;

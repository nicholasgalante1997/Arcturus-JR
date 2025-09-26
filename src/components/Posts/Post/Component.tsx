import React from 'react';
import { useParams } from 'react-router';

import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useGetPost } from '@/hooks/usePost';
import { pipeline } from '@/utils/pipeline';

import PostView from './View';

function Post() {
  const params = useParams();
  const postId = params?.id;
  const postQuery = useGetPost(postId as string);
  return (
    <SuspenseEnabledQueryProvider>
      <PostView queries={[postQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(React.memo)(Post) as React.MemoExoticComponent<typeof Post>;

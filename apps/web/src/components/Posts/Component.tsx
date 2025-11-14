import React from 'react';

import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useGetPosts } from '@/hooks/usePosts';

import PostsView from './View';

function PostsPage() {
  const posts = useGetPosts();
  return (
    <React.Fragment>
      <h1 style={{ marginBlockStart: '3rem' }}>Blog Posts</h1>
      <SuspenseEnabledQueryProvider>
        <PostsView queries={[posts]} />
      </SuspenseEnabledQueryProvider>
    </React.Fragment>
  );
}

export default PostsPage;

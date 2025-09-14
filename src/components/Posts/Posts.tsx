import React from 'react';
import { DQUI } from '@/components/DeferredQueryUI';
import { useGetPosts } from '@/hooks/usePosts';
import { PostCardsList } from './components/List';

function PostsPage() {
  const $posts = useGetPosts();
  return (
    <React.Fragment>
      <h1 style={{ marginBlockStart: '3rem' }}>Blog Posts</h1>
      <DQUI q={$posts}>
        <PostCardsList posts={$posts.data || []} />
      </DQUI>
    </React.Fragment>
  );
}

export default PostsPage;

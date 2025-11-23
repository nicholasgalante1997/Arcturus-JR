import React, { use } from 'react';

import { pipeline } from '@/utils/pipeline';

import { PostCardsList } from './components/List';
import { PostViewProps } from './types';

function PostsView({ queries }: PostViewProps) {
  const [_posts] = queries;
  const posts = use(_posts.promise);
  return <PostCardsList posts={posts || []} />;
}

export default pipeline(React.memo)(PostsView) as React.MemoExoticComponent<typeof PostsView>;

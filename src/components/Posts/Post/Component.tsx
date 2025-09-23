import React from 'react';
import { useParams } from 'react-router';

import { DQUI } from '@/components/Base/DeferredQueryUI';
import { useGetPost } from '@/hooks/usePost';

import PostView from './View';

function PostPage() {
  const params = useParams();
  const postId = params?.id;
  const postQuery = useGetPost(postId as string);
  return (
    <DQUI q={postQuery}>
      <PostView post={postQuery.data!} />
    </DQUI>
  );
}

export default React.memo(PostPage);

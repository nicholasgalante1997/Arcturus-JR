import { memo } from 'react';

import { Post } from '@/components/Posts';
import { AppLayout } from '@/layout/Layout';
import { pipeline } from '@/utils/pipeline';

function PostPage() {
  return (
    <AppLayout>
      <link rel="preload" as="style" href="/css/post.min.css" precedence="high" />
      <link rel="stylesheet" href="/css/post.min.css" precedence="high" />
      <Post />
    </AppLayout>
  );
}

export default pipeline(memo)(PostPage);

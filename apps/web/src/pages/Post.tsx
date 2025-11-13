import { BASE_V1_CSS } from '@arcjr/types';
import { memo } from 'react';

import { Post } from '@/components/Posts';
import { AppLayout } from '@/layout/Layout';
import { toLinkMarkup } from '@/utils/css';
import { pipeline } from '@/utils/pipeline';

function PostPage() {
  return (
    <AppLayout>
      {BASE_V1_CSS.map(toLinkMarkup)}
      <link rel="preload" as="style" href="/css/post.min.css" precedence="high" />
      <link rel="stylesheet" href="/css/post.min.css" precedence="high" />
      <Post />
    </AppLayout>
  );
}

export default pipeline(memo)(PostPage);

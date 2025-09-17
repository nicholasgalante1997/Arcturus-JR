import { memo } from 'react';

import Post from '@/components/Posts/Post/Component';
import AppLayout from '@/layout/Layout';
import { pipeline } from '@/utils/pipeline';

function PostPage() {
  return (
    <AppLayout>
      <Post />
    </AppLayout>
  );
}

export default pipeline(memo)(PostPage);

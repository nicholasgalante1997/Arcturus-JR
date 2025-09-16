import { memo } from 'react';
import AppLayout from '@/layout/Layout';
import Post from '@/components/Posts/Post/Component';
import { pipeline } from '@/utils/pipeline';

function PostPage() {
  return (
    <AppLayout>
      <Post />
    </AppLayout>
  );
}

export default pipeline(memo)(PostPage);

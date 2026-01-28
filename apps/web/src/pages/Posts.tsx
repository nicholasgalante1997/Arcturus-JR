import { BASE_V1_CSS } from '@arcjr/types';

import { Posts } from '@/components/Posts';
import { AppLayout } from '@/layout/Layout';
import { toLinkMarkup } from '@/utils/css';

function PostsPage() {
  return (
    <AppLayout>
      {BASE_V1_CSS.map(toLinkMarkup)}
      <link rel="preload" as="style" href="/css/post.min.css" precedence="high" />
      <link rel="stylesheet" href="/css/post.min.css" precedence="high" />
      <Posts />
    </AppLayout>
  );
}

export default PostsPage;

import { Posts } from '@/components/Posts';
import { AppLayout } from '@/layout/Layout';

function PostsPage() {
  return (
    <AppLayout>
      <link rel="preload" as="style" href="/css/post.min.css" precedence="high" />
      <link rel="stylesheet" href="/css/post.min.css" precedence="high" />
      <Posts />
    </AppLayout>
  );
}

export default PostsPage;

import type { Post } from '@/types/Post';

export interface HomePostSelection {
  featuredPost: Post | null;
  recentPosts: Post[];
}

export function selectHomePosts(posts: readonly Post[]): HomePostSelection {
  const visiblePosts = posts.filter((post) => post.visible);
  const featuredPost = visiblePosts.find((post) => post.featured) ?? visiblePosts[0] ?? null;

  return {
    featuredPost,
    recentPosts: visiblePosts.filter((post) => post.id !== featuredPost?.id).slice(0, 4)
  };
}

import type { Post } from '@/types/Post';

export interface FeaturedPostsProps {
  featuredPost: Post | null;
  recentPosts: Post[];
}

export interface PostCardV2Props {
  post: Post;
}

import type { Post } from '@/types/Post';

export interface FeaturedPostsProps {
  posts: Post[];
  limit?: number;
}

export interface PostCardV2Props {
  post: Post;
}

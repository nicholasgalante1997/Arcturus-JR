import type { Post } from '@/types/Post';
import type { UseQueryResult } from '@tanstack/react-query';

export interface V2PostsPageViewProps {
  queries: [PostsQuery];
}

export type PostsQuery = UseQueryResult<Post[], Error>;

export interface PostsGridProps {
  posts: Post[];
}

export interface ArchivePostRowProps {
  post: Post;
  prioritizeImage?: boolean;
}

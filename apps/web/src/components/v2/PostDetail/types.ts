import type { Post, PostWithMarkdown } from '@/types/Post';
import type { UseQueryResult } from '@tanstack/react-query';

export interface V2PostDetailViewProps {
  queries: [PostQuery, RelatedPostsQuery];
}

export type PostQuery = UseQueryResult<PostWithMarkdown, Error>;
export type RelatedPostsQuery = UseQueryResult<Post[], Error>;

export interface PostHeaderProps {
  post: PostWithMarkdown;
  readingTime: number;
}

export interface PostContentProps {
  content: string;
}

export interface TableOfContentsProps {
  headings: HeadingItem[];
  activeId: string | null;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export interface RelatedPostsProps {
  posts: Post[];
}

export interface PostNavigationProps {
  previousPost?: Post;
  nextPost?: Post;
}

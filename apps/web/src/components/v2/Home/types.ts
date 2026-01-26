import type { Post } from '@/types/Post';
import type { UseQueryResult } from '@tanstack/react-query';

export interface V2HomeViewProps {
  queries: [PostsQuery];
}

export type PostsQuery = UseQueryResult<Post[], Error>;

export interface HeroWidgetProps {
  /** Primary headline text */
  headline?: string;
  /** Subheadline/description text */
  subheadline?: string;
  /** Call-to-action button text */
  ctaText?: string;
  /** Call-to-action link destination */
  ctaHref?: string;
}

export interface FeaturedPostsProps {
  posts: Post[];
  /** Maximum number of posts to display */
  limit?: number;
}

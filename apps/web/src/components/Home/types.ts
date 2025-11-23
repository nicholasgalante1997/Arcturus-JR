import { UseQueryResult } from '@tanstack/react-query';

import { MarkdownDocument, Post } from '@/types';

type MarkdownQuery = UseQueryResult<MarkdownDocument>;
type PostsQuery = UseQueryResult<Post[]>;

export interface HomeViewProps {
  queries: [MarkdownQuery, PostsQuery];
}

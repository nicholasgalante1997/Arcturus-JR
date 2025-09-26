import { UseQueryResult } from '@tanstack/react-query';

import { Post } from '@/types';

type PostsQuery = UseQueryResult<Post[]>;

export interface PostViewProps {
  queries: [PostsQuery];
}

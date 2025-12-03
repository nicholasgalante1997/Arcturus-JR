import { type UseQueryResult } from '@tanstack/react-query';

import { getPosts } from '@/hooks/usePosts';

export type PostsQuery = UseQueryResult<Awaited<ReturnType<typeof getPosts>>>;

export interface V2PostGridViewProps {
    queries: [PostsQuery];
}

import { UseQueryResult } from '@tanstack/react-query';

import { PostWithMarkdown } from '@/types';

export type PostWithMarkdownQueryResult = UseQueryResult<PostWithMarkdown>;

export interface PostViewProps {
  queries: [PostWithMarkdownQueryResult];
}

import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';

import PostsService from '@/services/Posts';
import { isPostWithMarkdown } from '@/types/Post';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getPost(id: string) {
  const postsService = new PostsService();
  return postsService.fetchPost(id);
}

type GetPostDataResult = Awaited<ReturnType<typeof getPost>>;

export function useGetPost(id: string): UseQueryResult<GetPostDataResult> {
  const queryClient = useQueryClient();
  const queryKey = ['post', id];

  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey);
    if (!isPostWithMarkdown(data)) {
      const error = `[useGetPost:::server] data from query prefetch ${queryKey} is not a PostWithMarkdown.`;
      console.error(error, data);
      throw new Error(error);
    }
    return { data, promise: Promise.resolve(data) } as UseQueryResult<GetPostDataResult>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getPost(id)
  });
}

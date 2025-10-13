import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import PostsService from '@/services/Posts';
import { Post } from '@/types';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getPosts() {
  return new PostsService().fetchPosts();
}

export function useGetPosts(): UseQueryResult<Post[], Error> {
  const queryClient = useQueryClient();
  const queryKey = ['posts'];

  if (getJavascriptEnvironment() === 'server') {
    const data: Array<Post> = queryClient.getQueryData(queryKey) as Array<Post>;
    return { data, promise: Promise.resolve(data) } as UseQueryResult<Post[], Error>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getPosts()
  });
}

import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import PostsService from '@/services/Posts';
import { isPost, type Post } from '@/types/Post';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getPosts() {
  return new PostsService().fetchPosts();
}

export function useGetPosts(): UseQueryResult<Post[], Error> {
  const queryClient = useQueryClient();
  const queryKey = ['posts'];

  if (getJavascriptEnvironment() === 'server') {
    const data: Array<Post> = queryClient.getQueryData(queryKey) as Array<Post>;

    if (!Array.isArray(data)) {
      const error = `[useGetPosts:::server] data from query prefetch ${queryKey} is not an array.`;
      console.error(error, data);
      throw new Error(error);
    }

    if (!data.every(isPost)) {
      const error = `[useGetPosts:::server] data from query prefetch ${queryKey} is not an array of Post(s).`;
      console.error(error, data);
      throw new Error(error);
    }

    return { data, promise: Promise.resolve(data) } as UseQueryResult<Post[], Error>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getPosts()
  });
}

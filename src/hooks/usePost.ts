import { useQuery, useQueryClient } from '@tanstack/react-query';

import PostsService from '@/services/Posts';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getPost(id: string) {
  const postsService = new PostsService();
  return postsService.fetchPost(id);
}

export function useGetPost(id: string) {
  const queryClient = useQueryClient();
  const queryKey = ['post', id];

  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey);
    return { data, promise: Promise.resolve(data) };
  }

  return useQuery({
    queryKey,
    queryFn: () => getPost(id)
  });
}

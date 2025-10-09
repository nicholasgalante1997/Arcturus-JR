import { useQuery, useQueryClient } from '@tanstack/react-query';

import PostsService from '@/services/Posts';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getPosts() {
  return new PostsService().fetchPosts();
}

export function useGetPosts() {
  const queryClient = useQueryClient();
  const queryKey = ['posts'];
  
  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey);
    return { data, promise: Promise.resolve(data) };
  }
  
  return useQuery({
    queryKey,
    queryFn: () => getPosts()
  });
}

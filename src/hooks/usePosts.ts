import { useQuery } from '@tanstack/react-query';
import PostsService from '@/services/Posts';

async function getPosts() {
  return new PostsService().fetchPosts();
}

export function useGetPosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts()
  });
}

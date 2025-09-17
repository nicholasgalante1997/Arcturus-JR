import { useQuery } from '@tanstack/react-query';
import React from 'react';

import PostsService from '@/services/Posts';

async function getPost(id: string) {
  const postsService = new PostsService();
  return postsService.fetchPost(id);
}

export function useGetPost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id)
  });
}

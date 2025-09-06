import React from 'react';
import { useQuery } from '@tanstack/react-query';
import PostsService from '@/services/Posts';

async function getPosts() {
  const postsService = new PostsService();
  return postsService.fetchPosts();
}

export function useGetPosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts()
  });
}
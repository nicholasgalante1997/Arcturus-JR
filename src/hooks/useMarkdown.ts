import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MarkdownService from '@/services/Markdown';

async function getMarkdown(file: string) {
  const markdownService = new MarkdownService();
  return markdownService.fetchMarkdown(file);
}

export function useMarkdown(file: string) {
  return useQuery({
    queryKey: ['markdown', file],
    queryFn: () => getMarkdown(file)
  });
}

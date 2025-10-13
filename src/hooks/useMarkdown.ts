import { useQuery, useQueryClient } from '@tanstack/react-query';

import MarkdownService from '@/services/Markdown';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getMarkdown(file: string) {
  const markdownService = new MarkdownService();
  return markdownService.fetchMarkdown(file);
}

export function useMarkdown(file: string) {
  const queryClient = useQueryClient();
  const queryKey = ['markdown', file];

  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey);
    return { data, promise: Promise.resolve(data) };
  }

  return useQuery({
    queryKey,
    queryFn: () => getMarkdown(file)
  });
}

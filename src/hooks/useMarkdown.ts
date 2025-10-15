import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';

import MarkdownService from '@/services/Markdown';
import { isMarkdownDocument } from '@/types/MarkdownDocument';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getMarkdown(file: string) {
  const markdownService = new MarkdownService();
  return markdownService.fetchMarkdown(file);
}

type GetMarkdownDataResult = Awaited<ReturnType<typeof getMarkdown>>;

export function useMarkdown(file: string): UseQueryResult<GetMarkdownDataResult> {
  const queryClient = useQueryClient();
  const queryKey = ['markdown', file];

  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey);
    if (!isMarkdownDocument(data)) {
      const error = `[useMarkdown:::server] data from query prefetch ${queryKey} is not a MarkdownDocument.`;
      console.error(error, data);
      throw new Error(error);
    }
    return { data, promise: Promise.resolve(data) } as UseQueryResult<GetMarkdownDataResult>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getMarkdown(file)
  });
}

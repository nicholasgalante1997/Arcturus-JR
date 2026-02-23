import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import RfcService from '@/services/Rfc/RfcService';
import { isRfcWithContent, type RfcWithContent } from '@/types/Rfc';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getRfc(id: string): Promise<RfcWithContent> {
  return new RfcService().fetchRfc(id);
}

export function useGetRfc(id: string): UseQueryResult<RfcWithContent, Error> {
  const queryClient = useQueryClient();
  const queryKey = ['rfc', id];

  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey) as RfcWithContent;

    if (!isRfcWithContent(data)) {
      const error = `[useGetRfc:::server] data from query prefetch ${queryKey} is not a valid RfcWithContent.`;
      console.error(error, data);
      throw new Error(error);
    }

    return { data, promise: Promise.resolve(data) } as UseQueryResult<RfcWithContent, Error>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getRfc(id)
  });
}

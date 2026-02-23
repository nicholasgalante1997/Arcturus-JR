import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import RfcService from '@/services/Rfc/RfcService';
import { isRfc, type Rfc } from '@/types/Rfc';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getRfcs(): Promise<Rfc[]> {
  return new RfcService().fetchRfcs();
}

export function useGetRfcs(): UseQueryResult<Rfc[], Error> {
  const queryClient = useQueryClient();
  const queryKey = ['rfcs'];

  if (getJavascriptEnvironment() === 'server') {
    const data: Array<Rfc> = queryClient.getQueryData(queryKey) as Array<Rfc>;

    if (!Array.isArray(data)) {
      const error = `[useGetRfcs:::server] data from query prefetch ${queryKey} is not an array.`;
      console.error(error, data);
      throw new Error(error);
    }

    if (!data.every(isRfc)) {
      const error = `[useGetRfcs:::server] data from query prefetch ${queryKey} is not an array of Rfc(s).`;
      console.error(error, data);
      throw new Error(error);
    }

    return { data, promise: Promise.resolve(data) } as UseQueryResult<Rfc[], Error>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getRfcs()
  });
}

import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import { CipherFetchService } from '@/services/Cipher';
import { isCipherJSON } from '@/services/Cipher/CipherFetchService/types/ICipherFetchService';
import { getJavascriptEnvironment } from '@/utils/env';

import type { CipherJSON } from '@/services/Cipher/CipherFetchService/types/ICipherFetchService';

export async function getCiphers() {
  return new CipherFetchService().fetchCipherTextsIndex();
}

export function useGetCiphers(): UseQueryResult<CipherJSON[], Error> {
  const queryClient = useQueryClient();
  const queryKey = ['ciphers'];

  if (getJavascriptEnvironment() === 'server') {
    const data: Array<CipherJSON> = queryClient.getQueryData(queryKey) as Array<CipherJSON>;

    if (!Array.isArray(data)) {
      const error = `[useGetCiphers:::server] data from query prefetch ${queryKey} is not an array.`;
      console.error(error, data);
      throw new Error(error);
    }

    if (!data.every(isCipherJSON)) {
      const error = `[useGetCiphers:::server] data from query prefetch ${queryKey} is not an array of CipherJSON(s).`;
      console.error(error, data);
      throw new Error(error);
    }

    return { data, promise: Promise.resolve(data) } as UseQueryResult<CipherJSON[], Error>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getCiphers()
  });
}

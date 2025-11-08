import { useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { CipherFetchService } from '@/services/Cipher';
import { isCipherDTO } from '@/services/Cipher/CipherFetchService/types/ICipherFetchService';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getCipher(cipher_name: string) {
  const postsService = new CipherFetchService();
  return postsService.fetchCipherText(cipher_name);
}

export type GetCipherDataResult = Awaited<ReturnType<typeof getCipher>>;

export function useGetCipher(
  cipher_name: string,
  options: Pick<UseQueryOptions<GetCipherDataResult>, 'enabled'> = {}
): UseQueryResult<GetCipherDataResult> {
  const queryClient = useQueryClient();
  const queryKey = ['cipher', cipher_name];

  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey);
    if (!isCipherDTO(data)) {
      const error = `[useGetCipher:::server] data from query prefetch ${queryKey} is not a valid CipherDTO.`;
      console.error(error, data);
      throw new Error(error);
    }
    return { data, promise: Promise.resolve(data) } as UseQueryResult<GetCipherDataResult>;
  }

  return useQuery({
    ...options,
    queryKey,
    queryFn: () => getCipher(cipher_name)
  });
}

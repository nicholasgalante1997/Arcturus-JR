import type { GetCipherDataResult } from '@/hooks/useCipher';
import type { UseQueryResult } from '@tanstack/react-query';

type CipherQuery = UseQueryResult<GetCipherDataResult>;

export interface CipherViewProps {
  queries: [CipherQuery];
}

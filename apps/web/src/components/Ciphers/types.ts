import type { CipherJSON } from '@/services/Cipher/CipherFetchService/types/ICipherFetchService';
import type { UseQueryResult } from '@tanstack/react-query';

type CiphersQuery = UseQueryResult<Array<CipherJSON>>;

export interface CiphersViewProps {
  queries: [CiphersQuery];
}

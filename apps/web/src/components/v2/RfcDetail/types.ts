import type { RfcWithContent } from '@/types/Rfc';
import type { UseQueryResult } from '@tanstack/react-query';

export interface V2RfcDetailViewProps {
  queries: [RfcQuery];
}

export type RfcQuery = UseQueryResult<RfcWithContent, Error>;

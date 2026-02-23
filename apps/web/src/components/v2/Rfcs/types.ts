import type { Rfc } from '@/types/Rfc';
import type { UseQueryResult } from '@tanstack/react-query';

export interface V2RfcsPageViewProps {
  queries: [RfcsQuery];
}

export type RfcsQuery = UseQueryResult<Rfc[], Error>;

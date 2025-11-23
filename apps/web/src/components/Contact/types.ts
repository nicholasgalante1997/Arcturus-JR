import { UseQueryResult } from '@tanstack/react-query';

import { MarkdownDocument } from '@/types';

type MarkdownQuery = UseQueryResult<MarkdownDocument>;

export interface ContactViewProps {
  queries: [MarkdownQuery];
}

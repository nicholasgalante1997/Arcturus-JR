import type { PropsWithChildren, ReactNode } from 'react';
import { type UseQueryResult } from '@tanstack/react-query';

export type DeferredQueryUIProps = PropsWithChildren<{
  q: UseQueryResult;
  placeholder?: ReactNode;
  fallback?: ReactNode;
}>;

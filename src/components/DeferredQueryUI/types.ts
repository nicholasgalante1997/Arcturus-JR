import type { PropsWithChildren, ReactNode } from 'react';
import { type UseQueryResult } from '@tanstack/react-query';

export type ErrorComponentAssumedProps = {
    error: unknown;
    [key: string]: unknown;
}

export type ErrorComponentType = React.ComponentType<ErrorComponentAssumedProps>;

export type DeferredQueryUIProps = PropsWithChildren<{
  q: UseQueryResult;
  placeholder?: ReactNode;
  fallback?: ErrorComponentType;
}>;

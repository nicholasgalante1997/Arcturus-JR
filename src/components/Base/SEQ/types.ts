import type { PropsWithChildren, ReactNode } from 'react';

export type ErrorComponentAssumedProps = {
  error: unknown;
  reset?: () => void;
  [key: string]: unknown;
};

export type ErrorComponentType = React.ComponentType<ErrorComponentAssumedProps>;

export type SEQProps = PropsWithChildren<{
  placeholder?: ReactNode;
  fallback?: ErrorComponentType;
}>;

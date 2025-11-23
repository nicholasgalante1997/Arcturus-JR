import { ReactNode } from 'react';

export type BadgeVariant = 'info' | 'success' | 'warning' | 'error';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

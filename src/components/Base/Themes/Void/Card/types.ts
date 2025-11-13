import React from 'react';

export interface VoidCardProps extends Omit<React.HTMLProps<HTMLDivElement>, 'action' | 'title'> {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  body: React.ReactNode;
  action: VoidCardActionsProps;
  badge?: VoidCardSingleBadgeProps;
}

interface VoidCardActionsProps {
  label: string;
  href: string;
  target?: '_self' | '_blank';
  _preferReactRouterLink?: boolean;
}

interface VoidCardSingleBadgeProps {
  label: string;
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

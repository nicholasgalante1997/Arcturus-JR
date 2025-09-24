import React from 'react';

export type CodeComponentProps = {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

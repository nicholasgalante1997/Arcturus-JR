import type { ReactNode } from 'react';

export interface V2AppLayoutProps {
  /** Page content to render between header and footer */
  children: ReactNode;
  /** Whether header should start transparent */
  transparentHeader?: boolean;
  /** Additional className for the layout wrapper */
  className?: string;
  /** Whether to show the footer (default: true) */
  showFooter?: boolean;
}

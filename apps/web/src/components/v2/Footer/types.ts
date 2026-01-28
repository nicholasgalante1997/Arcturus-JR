import type { ReactNode } from 'react';

export interface V2FooterProps {
  /** Custom className for additional styling */
  className?: string;
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: ReactNode;
  ariaLabel: string;
}

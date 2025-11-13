import React from 'react';

import { pipeline } from '@/utils/pipeline';

import type { SocialLink } from './types';

interface SocialIconsProps {
  links: SocialLink[];
}

function SocialIcons({ links }: SocialIconsProps) {
  return (
    <div className="v2-footer__social">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="v2-footer__social-link"
          aria-label={link.ariaLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

export default pipeline(React.memo)(SocialIcons) as React.MemoExoticComponent<typeof SocialIcons>;

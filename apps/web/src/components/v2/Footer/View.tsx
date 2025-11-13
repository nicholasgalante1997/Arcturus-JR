import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router';

import { pipeline } from '@/utils/pipeline';

import SocialIcons from './SocialIcons';

import type { FooterSection, SocialLink, V2FooterProps } from './types';

// GitHub Icon
const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

// LinkedIn Icon
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'Home', href: '/v2' },
      { label: 'Posts', href: '/v2/posts' },
      { label: 'About', href: '/v2/about' },
      { label: 'Contact', href: '/v2/contact' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'GitHub', href: 'https://github.com/nicholasgalante1997/Arcturus-JR', external: true },
      { label: 'Bun Documentation', href: 'https://bun.sh', external: true },
      { label: 'React Documentation', href: 'https://react.dev', external: true }
    ]
  }
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/nicholasgalante1997',
    icon: <GitHubIcon />,
    ariaLabel: 'Visit my GitHub profile'
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nicholas-g-1963041a2/',
    icon: <LinkedInIcon />,
    ariaLabel: 'Connect on LinkedIn'
  }
];

function V2FooterView({ className }: V2FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={clsx('v2-footer', className)}>
      <div className="v2-footer__container">
        {/* Top Section */}
        <div className="v2-footer__top">
          {/* Brand */}
          <div className="v2-footer__brand">
            <Link to="/v2" className="v2-footer__logo">
              <span className="v2-footer__logo-text">Arc-Jr</span>
            </Link>
            <p className="v2-footer__tagline">
              Building the future with React, TypeScript, and modern web technologies.
            </p>
            <SocialIcons links={SOCIAL_LINKS} />
          </div>

          {/* Navigation Sections */}
          <div className="v2-footer__sections">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="v2-footer__section">
                <h3 className="v2-footer__section-title">{section.title}</h3>
                <ul className="v2-footer__link-list">
                  {section.links.map((link) => (
                    <li key={link.href} className="v2-footer__link-item">
                      {link.external ? (
                        <a
                          href={link.href}
                          className="v2-footer__link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.href} className="v2-footer__link">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="v2-footer__bottom">
          <p className="v2-footer__copyright">{currentYear} Arc-Jr. All rights reserved.</p>
          <p className="v2-footer__attribution">
            Built with{' '}
            <span className="v2-footer__heart" aria-label="love">
              love
            </span>{' '}
            using React 19 and Bun
          </p>
        </div>
      </div>
    </footer>
  );
}

export default pipeline(React.memo)(V2FooterView) as React.MemoExoticComponent<typeof V2FooterView>;

import { ExternalLinksConfig } from '@arcjr/config';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router';

import { pipeline } from '@/utils/pipeline';

import type { V2HeaderViewProps } from './types';

export enum ARCJR_V2_TABS {
  HOME = '/v2',
  POSTS = '/v2/post',
  ABOUT = '/v2/about',
  CONTACT = '/v2/contact'
}

export function getActiveTabByPathname(tab: string) {
  if (typeof window === 'undefined') return 'default' as const;
  const url = new URL(window.location.href);
  const pathname = url.pathname;
  if (tab === '/') {
    if (pathname === '/v2' || pathname === '') return 'active' as const;
    return 'default' as const;
  }

  return pathname.startsWith(tab) ? ('active' as const) : ('default' as const);
}

const LINKEDIN_HREF = ExternalLinksConfig.ExternalLinkLinkedIn;
const GITHUB_HREF = ExternalLinksConfig.ExternalLinkGithub;

function V2HeaderView({
  transparent = false,
  className,
  isScrolled,
  isMobileMenuOpen,
  onToggleMobileMenu
}: V2HeaderViewProps) {
  const showBackground = !transparent || isScrolled;

  return (
    <header
      className={clsx('v2-header', className)}
      data-scrolled={showBackground}
      data-menu-open={isMobileMenuOpen}
    >
      <div className="container">
        <Link id="header-logo" to="/v2">
          <img
            src="/assets/founder.webp"
            alt="Profile Image"
            style={{
              objectFit: 'contain',
              objectPosition: 'center',
              aspectRatio: '4/3',
              height: '64px',
              width: 'auto',
              overflow: 'hidden'
            }}
          />

          <h1>Arcturus</h1>
        </Link>
        <nav>
          <ul>
            <li>
              <Link data-active-tab={getActiveTabByPathname(ARCJR_V2_TABS.HOME)} to="/v2">
                Home
              </Link>
            </li>
            <li>
              <Link data-active-tab={getActiveTabByPathname(ARCJR_V2_TABS.POSTS)} to="/v2/posts">
                Posts
              </Link>
            </li>
            <li>
              <Link data-active-tab={getActiveTabByPathname(ARCJR_V2_TABS.ABOUT)} to="/v2/about">
                About
              </Link>
            </li>
            <li>
              <Link data-active-tab={getActiveTabByPathname(ARCJR_V2_TABS.CONTACT)} to="/v2/contact">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="external-links">
          <Link className="external-icon-link" target="_blank" to={GITHUB_HREF} id="gh-icon-link">
            <img height="24px" width="auto" src="/assets/icons/github-mark-white.svg" />
          </Link>
          <Link className="external-icon-link" target="_blank" to={LINKEDIN_HREF} id="in-icon-link">
            <img height="24px" width="auto" src="/assets/icons/InBug-White.png" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={onToggleMobileMenu}
        >
          <span className="hamburger">
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          <ul>
            <li>
              <Link to="/v2" onClick={onToggleMobileMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/v2/posts" onClick={onToggleMobileMenu}>
                Posts
              </Link>
            </li>
            <li>
              <Link to="/v2/about" onClick={onToggleMobileMenu}>
                About
              </Link>
            </li>
            <li>
              <Link to="/v2/contact" onClick={onToggleMobileMenu}>
                Contact
              </Link>
            </li>
          </ul>
          <div className="external-links">
            <Link
              className="external-icon-link"
              target="_blank"
              to={GITHUB_HREF}
              onClick={onToggleMobileMenu}
            >
              <img height="24px" width="auto" src="/assets/icons/github-mark-white.svg" />
            </Link>
            <Link
              className="external-icon-link"
              target="_blank"
              to={LINKEDIN_HREF}
              onClick={onToggleMobileMenu}
            >
              <img height="24px" width="auto" src="/assets/icons/InBug-White.png" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export default pipeline(React.memo)(V2HeaderView) as React.MemoExoticComponent<typeof V2HeaderView>;

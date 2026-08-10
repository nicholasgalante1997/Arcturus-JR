import { ExternalLinksConfig } from '@arcjr/config';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router';

import copy from '@/content/en.json';
import { formatMessage } from '@/utils/formatMessage';
import { pipeline } from '@/utils/pipeline';

import type { V2HeaderViewProps } from './types';

export enum ARCJR_V2_TABS {
  HOME = '/',
  POSTS = '/post',
  RFCS = '/rfc',
  ABOUT = '/about',
  CONTACT = '/contact'
}

export function getActiveTabByPathname(tab: string) {
  if (typeof window === 'undefined') return 'default' as const;
  const url = new URL(window.location.href);
  const pathname = url.pathname;
  if (tab === '/') {
    if (pathname === '/') return 'active' as const;
    return 'default' as const;
  }

  return pathname.startsWith(tab) ? ('active' as const) : ('default' as const);
}

const LINKEDIN_HREF = ExternalLinksConfig.ExternalLinkLinkedIn;
const GITHUB_HREF = ExternalLinksConfig.ExternalLinkGithub;

const SHOW_IMAGE_LOGO = false;

const NAVIGATION_ITEMS = [
  { href: '/', activeTab: ARCJR_V2_TABS.HOME, label: copy.site.navigation.home },
  { href: '/posts', activeTab: ARCJR_V2_TABS.POSTS, label: copy.site.navigation.posts },
  { href: '/rfcs', activeTab: ARCJR_V2_TABS.RFCS, label: copy.site.navigation.rfcs },
  { href: '/about', activeTab: ARCJR_V2_TABS.ABOUT, label: copy.site.navigation.about },
  { href: '/contact', activeTab: ARCJR_V2_TABS.CONTACT, label: copy.site.navigation.contact }
] as const;

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.82c.85 0 1.71.12 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.5 8.25H3.25V21H6.5V8.25ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM21 13.69c0-3.84-2.05-5.63-4.79-5.63a4.14 4.14 0 0 0-3.74 2.05V8.25H9.22V21h3.25v-6.31c0-1.66.32-3.28 2.39-3.28 2.04 0 2.06 1.91 2.06 3.39V21H21v-7.31Z"
      />
    </svg>
  );
}

function ThemeIcon({ theme }: Pick<V2HeaderViewProps, 'theme'>) {
  if (theme === 'light') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (theme === 'dark') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20.25 15.2A8.5 8.5 0 0 1 8.8 3.75 8.5 8.5 0 1 0 20.25 15.2Z"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 21h8M12 17v4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function V2HeaderView({
  transparent = false,
  className,
  isScrolled,
  isMobileMenuOpen,
  onToggleMobileMenu,
  theme,
  onCycleTheme
}: V2HeaderViewProps) {
  const showBackground = !transparent || isScrolled;

  return (
    <header
      className={clsx('v2-header', className)}
      data-scrolled={showBackground}
      data-menu-open={isMobileMenuOpen}
    >
      <div className="container">
        <Link id="header-logo" to="/">
          {SHOW_IMAGE_LOGO && (
            <img
              src="/assets/poke-stock/champion-gang.webp"
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
          )}

          <h1>{copy.site.name}</h1>
        </Link>
        <nav aria-label={copy.site.navigationLabel}>
          <ul>
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.href}>
                <Link data-active-tab={getActiveTabByPathname(item.activeTab)} to={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="external-links">
          <Link
            className="external-icon-link"
            target="_blank"
            rel="noopener noreferrer"
            to={GITHUB_HREF}
            id="gh-icon-link"
            aria-label={copy.site.social.githubProfileLabel}
          >
            <GitHubIcon />
          </Link>
          <Link
            className="external-icon-link"
            target="_blank"
            rel="noopener noreferrer"
            to={LINKEDIN_HREF}
            id="in-icon-link"
            aria-label={copy.site.social.linkedinProfileLabel}
          >
            <LinkedInIcon />
          </Link>
        </div>
        <button
          type="button"
          className="theme-toggle"
          aria-label={formatMessage(copy.site.theme.controlLabel, {
            theme: copy.site.theme[theme],
            nextTheme:
              theme === 'system'
                ? copy.site.theme.light
                : theme === 'light'
                  ? copy.site.theme.dark
                  : copy.site.theme.system
          })}
          title={formatMessage(copy.site.theme.controlTitle, { theme: copy.site.theme[theme] })}
          onClick={onCycleTheme}
        >
          <ThemeIcon theme={theme} />
          <span className="theme-toggle__label">{copy.site.theme[theme]}</span>
        </button>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={copy.site.toggleNavigationLabel}
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
        <nav className="mobile-menu" aria-label={copy.site.mobileNavigationLabel}>
          <ul>
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.href}>
                <Link to={item.href} onClick={onToggleMobileMenu}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="external-links">
            <Link
              className="external-icon-link"
              target="_blank"
              to={GITHUB_HREF}
              onClick={onToggleMobileMenu}
              aria-label={copy.site.social.githubProfileLabel}
            >
              <GitHubIcon />
            </Link>
            <Link
              className="external-icon-link"
              target="_blank"
              to={LINKEDIN_HREF}
              onClick={onToggleMobileMenu}
              aria-label={copy.site.social.linkedinProfileLabel}
            >
              <LinkedInIcon />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export default pipeline(React.memo)(V2HeaderView) as React.MemoExoticComponent<typeof V2HeaderView>;

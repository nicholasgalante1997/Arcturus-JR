import { ExternalLinksConfig } from '@arcjr/config';
import React from 'react';
import { Link } from 'react-router';

import { pipeline } from '@/utils/pipeline';

export enum ARCJR_TABS {
  HOME = '/archives/v1',
  POSTS = '/archives/v1/posts',
  ABOUT = '/archives/v1/about',
  CONTACT = '/archives/v1/contact'
}

const LINKED_IN_HREF = ExternalLinksConfig.ExternalLinkLinkedIn;
const GITHUB_HREF = ExternalLinksConfig.ExternalLinkGithub;

export function getActiveTabByPathname(tab: string) {
  if (typeof window === 'undefined') return 'default' as const;
  const url = new URL(window.location.href);
  const pathname = url.pathname;
  if (tab === '/archives/v1') {
    if (pathname === '/archives/v1' || pathname === '/archives/v1/') return 'active' as const;
    return 'default' as const;
  }

  return pathname.startsWith(tab) ? ('active' as const) : ('default' as const);
}

function Header() {
  return (
    <header>
      <div className="container">
        <Link to="/archives/v1">
          <div id="nav-profile-image">
            <img
              src="/assets/doodles-ember.avif"
              alt="Profile Image"
              height="50"
              width="50"
              style={{ objectFit: 'contain', objectPosition: 'center', aspectRatio: 1 }}
            />
          </div>

          <h1>nickgalante</h1>
        </Link>
        <nav>
          <ul>
            <li>
              <Link data-active-tab={getActiveTabByPathname(ARCJR_TABS.HOME)} to="/archives/v1">
                Home
              </Link>
            </li>
            <li>
              <Link data-active-tab={getActiveTabByPathname(ARCJR_TABS.POSTS)} to="/archives/v1/posts">
                Posts
              </Link>
            </li>
            <li>
              <Link data-active-tab={getActiveTabByPathname(ARCJR_TABS.ABOUT)} to="/archives/v1/about">
                About
              </Link>
            </li>
            <li>
              <Link data-active-tab={getActiveTabByPathname(ARCJR_TABS.CONTACT)} to="/archives/v1/contact">
                Contact
              </Link>
            </li>
            <li>
              <Link target="_blank" to={GITHUB_HREF} id="gh-icon-link">
                <img height="24px" width="auto" src="/assets/icons/github-mark-white.svg" />
              </Link>
            </li>
            <li>
              <Link target="_blank" to={LINKED_IN_HREF} id="in-icon-link">
                <img height="24px" width="auto" src="/assets/icons/InBug-White.png" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default pipeline(React.memo)(Header) as React.MemoExoticComponent<typeof Header>;

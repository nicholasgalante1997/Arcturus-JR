import { ExternalLinksConfig } from '@arcjr/config';
import React from 'react';
import { Link } from 'react-router';

import { ARCJR_TABS, getActiveTabByPathname } from '@/components/Header/View';
import { pipeline } from '@/utils/pipeline';

const LINKEDIN_HREF = ExternalLinksConfig.ExternalLinkLinkedIn;
const GITHUB_HREF = ExternalLinksConfig.ExternalLinkGithub;

function V2HeaderView() {
  return (
    <header>
      <div className="container">
        <Link to="/">
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
              <Link data-active-tab={getActiveTabByPathname(ARCJR_TABS.HOME)} to="/">
                Home
              </Link>
            </li>
            <li>
              <Link data-active-tab={getActiveTabByPathname(ARCJR_TABS.POSTS)} to="/posts">
                Posts
              </Link>
            </li>
            <li>
              <Link data-active-tab={getActiveTabByPathname(ARCJR_TABS.ABOUT)} to="/about">
                About
              </Link>
            </li>
            <li>
              <Link data-active-tab={getActiveTabByPathname(ARCJR_TABS.CONTACT)} to="/contact">
                Contact
              </Link>
            </li>
            <li>
              <Link target="_blank" to={GITHUB_HREF} id="gh-icon-link">
                <img height="24px" width="auto" src="/assets/icons/github-mark-white.svg" />
              </Link>
            </li>
            <li>
              <Link target="_blank" to={LINKEDIN_HREF} id="in-icon-link">
                <img height="24px" width="auto" src="/assets/icons/InBug-White.png" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default pipeline(React.memo)(V2HeaderView) as React.MemoExoticComponent<typeof V2HeaderView>;

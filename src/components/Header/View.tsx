import React from 'react';
import { Link } from 'react-router';

import CONFIG from '@/config/config';
import { pipeline } from '@/utils/pipeline';

function Header() {
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
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to={CONFIG.LINKS.GITHUB} id="gh-icon-link">
                <img height="24px" width="auto" src="/assets/icons/github-mark-white.svg" />
              </Link>
            </li>
            <li>
              <Link to={CONFIG.LINKS.LINKEDIN} id="in-icon-link">
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

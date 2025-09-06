import React from 'react';

function Header() {
  return (
    <header>
      <div className="container">
        <a href="/" data-link>
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
        </a>
        <nav>
          <ul>
            <li>
              <a href="/" data-link>
                Home
              </a>
            </li>
            <li>
              <a href="/posts" data-link>
                Posts
              </a>
            </li>
            <li>
              <a href="/about" data-link>
                About
              </a>
            </li>
            <li>
              <a href="/contact" data-link>
                Contact
              </a>
            </li>
            <li>
              <span id="gh-icon-link">
                <img height="24" width="auto" src="/assets/icons/github-mark-white.svg" />
              </span>
            </li>
            <li>
              <span id="in-icon-link">
                <img height="24" width="auto" src="/assets/icons/InBug-White.png" />
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default React.memo(Header);

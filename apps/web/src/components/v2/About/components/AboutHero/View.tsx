import { memo } from 'react';

import { pipeline } from '@/utils/pipeline';

function AboutHeroView() {
  return (
    <section className="v2-about-hero">
      <div className="v2-about-hero__content">
        <div className="v2-about-hero__image-container">
          <img src="/assets/headshot.jpg" alt="Nick Galante" className="v2-about-hero__image" />
          <div className="v2-about-hero__image-glow" aria-hidden="true" />
        </div>
        <div className="v2-about-hero__text">
          <h1 className="v2-about-hero__title">
            Hi, I&apos;m <span className="v2-about-hero__name">Nick</span>
          </h1>
          <p className="v2-about-hero__subtitle">Senior Software Engineer & Design Technologist</p>
          <p className="v2-about-hero__bio">
            I architect distributed systems, build developer tooling, and create performant web experiences.
            Currently at Charter Communications, previously Amazon Games. Passionate about Rust, React, Bun,
            micro-frontends, and web performance optimization.
          </p>
          <div className="v2-about-hero__actions">
            <a href="/contact" className="void-button void-button--primary">
              Get in touch
            </a>
            <a
              href="https://github.com/nicholasgalante1997"
              className="void-button void-button--outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default pipeline(memo)(AboutHeroView);

import { memo } from 'react';
import { Link } from 'react-router';

import { pipeline } from '@/utils/pipeline';

import type { HeroWidgetProps } from '../../types';

const heroText = {
  title: 'Project Arcturus',
  version: 'v2',
  subtitle: `This is a space I've created to share thoughts, opinions, technical essays, instructional guides, tirades, and anything that doesn't fit into a stricter category above.`
};

const DEFAULT_HEADLINE = heroText.title + ' ' + heroText.version;
const DEFAULT_SUBHEADLINE = heroText.subtitle;
const DEFAULT_CTA_TEXT = 'Read the Blog';
const DEFAULT_CTA_HREF = '/posts';

function HeroWidgetView({
  headline = DEFAULT_HEADLINE,
  subheadline = DEFAULT_SUBHEADLINE,
  ctaText = DEFAULT_CTA_TEXT,
  ctaHref = DEFAULT_CTA_HREF
}: HeroWidgetProps) {
  return (
    <section className="v2-hero" aria-labelledby="hero-headline">
      <div className="v2-hero__content">
        <h1 id="hero-headline" className="v2-hero__headline">
          {headline}
        </h1>
        <p className="v2-hero__subheadline">{subheadline}</p>
        <div className="v2-hero__actions">
          <Link to={ctaHref} className="v2-hero__cta void-button void-button--primary">
            {ctaText}
            <svg
              className="v2-hero__cta-icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 10h12m0 0l-4-4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className="v2-hero__decoration" aria-hidden="true">
        <div className="v2-hero__glow v2-hero__glow--primary" />
        <div className="v2-hero__glow v2-hero__glow--secondary" />
      </div>
    </section>
  );
}

export default pipeline(memo)(HeroWidgetView);

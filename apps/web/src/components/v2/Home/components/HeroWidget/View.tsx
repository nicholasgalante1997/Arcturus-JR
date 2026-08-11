import { memo } from 'react';
import { Link } from 'react-router';

import copy from '@/content/en.json';
import { pipeline } from '@/utils/pipeline';

import type { HeroWidgetProps } from '../../types';

const DEFAULT_HEADLINE = copy.home.hero.title;
const DEFAULT_SUBHEADLINE = copy.home.hero.subtitle;
const DEFAULT_CTA_TEXT = copy.home.hero.cta;
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
          <span>{headline}</span>{' '}
          <img
            className="v2-hero__greeting"
            src="/assets/gifs/waving-pikachu.gif"
            alt=""
            width="50"
            height="46"
            aria-hidden="true"
          />
        </h1>
        <p className="v2-hero__subheadline">{subheadline}</p>
        <div className="v2-hero__actions">
          <Link to={ctaHref} className="v2-hero__cta">
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
    </section>
  );
}

export default pipeline(memo)(HeroWidgetView);

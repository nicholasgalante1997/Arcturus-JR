import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

import { AnchorTooltip } from '@/components/v2/shared/AnchorTooltip';
import copy from '@/content/en.json';
import { pipeline } from '@/utils/pipeline';

import type { HeroWidgetProps } from '../../types';

const DEFAULT_HEADLINE = copy.home.hero.title;
const DEFAULT_SUBHEADLINE = copy.home.hero.subtitle;
const DEFAULT_CTA_TEXT = copy.home.hero.cta;
const DEFAULT_CTA_HREF = '/posts';
const DEFAULT_TOOLTIP_TEXT = copy.home.hero.tooltipMessage;
const DEFAULT_TOOLTIP_ANCHOR_CLASS = 'subheadline-tooltip';
const DEFAULT_TOOLTIP_ANCHOR_NAME = `--${DEFAULT_TOOLTIP_ANCHOR_CLASS}`;
const HOMEPAGE_TOOLTIP_ID = 'homepage-subheadline-tooltip';

function HeroWidgetView({
  headline = DEFAULT_HEADLINE,
  subheadline = DEFAULT_SUBHEADLINE,
  ctaText = DEFAULT_CTA_TEXT,
  ctaHref = DEFAULT_CTA_HREF,
  tooltipMessage = DEFAULT_TOOLTIP_TEXT
}: HeroWidgetProps) {
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const subheadlineElement = subheadlineRef.current;
    if (!subheadlineElement) {
      return;
    }

    subheadlineElement.innerHTML = subheadline;

    const anchor = subheadlineElement.querySelector<HTMLElement>(`.${DEFAULT_TOOLTIP_ANCHOR_CLASS}`);
    if (!anchor) {
      return;
    }

    const show = () => setShowTooltip(true);
    const hide = () => setShowTooltip(false);

    anchor.tabIndex = 0;
    anchor.setAttribute('aria-describedby', HOMEPAGE_TOOLTIP_ID);
    anchor.addEventListener('mouseenter', show);
    anchor.addEventListener('mouseleave', hide);
    anchor.addEventListener('focus', show);
    anchor.addEventListener('blur', hide);

    return () => {
      anchor.removeEventListener('mouseenter', show);
      anchor.removeEventListener('mouseleave', hide);
      anchor.removeEventListener('focus', show);
      anchor.removeEventListener('blur', hide);
    };
  }, [subheadline]);

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
        <p className="v2-hero__subheadline" ref={subheadlineRef}>
          {subheadline}
        </p>
        <AnchorTooltip
          id={HOMEPAGE_TOOLTIP_ID}
          className="v2-hero__tooltip"
          visible={showTooltip}
          anchor={DEFAULT_TOOLTIP_ANCHOR_NAME}
        >
          {tooltipMessage}
        </AnchorTooltip>
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
      <div className="v2-hero__collage" aria-hidden="true">
        <figure className="v2-hero__collage-panel v2-hero__collage-panel--cipher">
          <img src="/assets/hero-illustrations/cipher-wheel-hero.png" alt="" />
        </figure>
        <figure className="v2-hero__collage-panel v2-hero__collage-panel--filesystem">
          <img src="/assets/hero-illustrations/filesystem-atlas-hero.png" alt="" />
        </figure>
        <figure className="v2-hero__collage-panel v2-hero__collage-panel--terminal">
          <img src="/assets/hero-illustrations/terminal-fragment-hero.png" alt="" />
        </figure>
      </div>
    </section>
  );
}

export default pipeline(memo)(HeroWidgetView);

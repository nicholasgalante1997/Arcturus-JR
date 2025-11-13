import { memo } from 'react';

import { pipeline } from '@/utils/pipeline';

const likes = [
  'Performant, Scalable, Frameworkless React',
  'Working in the Bun runtime',
  'Supporting Decisions with Objective Metrics',
  'Building Design Systems & Component Libraries',
  'Accessibility as a First Class Citizen',
  'Architecting High Availability Distributed Systems',
  'Rust',
  'Go',
  'Cryptography',
  'Dogs'
];
const dislikes = [
  'Vercel/Next.js',
  'React Frameworks',
  'React Server Components',
  'Vibe Coders',
  'Anecdotal Evidence',
  "People who aren't nice to animals."
];

function AboutHeroView() {
  return (
    <section className="v2-about-hero">
      <div className="v2-about-hero__content">
        <div className="v2-about-hero__image-container">
          <img src="/assets/founder.webp" alt="Nick Galante" className="v2-about-hero__image" />
          <div className="v2-about-hero__image-glow" aria-hidden="true" />
        </div>
        <div className="v2-about-hero__text">
          <h1 className="v2-about-hero__title">
            Hi, I&apos;m <span className="v2-about-hero__name">Nick</span>
          </h1>
          <p className="v2-about-hero__subtitle">Senior Software Engineer</p>
          <p className="v2-about-hero__bio">
            <b style={{ fontWeight: '600', color: 'white' }}>What I like and appreciate:</b>{' '}
            {likes.join(', ')}
            <br />
            <b style={{ fontWeight: '600', color: 'white' }}>What I don&apos;t like:</b> {dislikes.join(', ')}
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

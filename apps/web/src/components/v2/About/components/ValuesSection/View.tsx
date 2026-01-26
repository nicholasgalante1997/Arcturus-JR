import { memo } from 'react';

import { pipeline } from '@/utils/pipeline';

const VALUES = [
  {
    title: 'Web Performance',
    description:
      'Obsessed with maximizing frontend performance through new browser APIs and ECMAScript features.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    title: 'Systems Programming',
    description:
      "Rust is my favorite. It's leveling me up as a programmer in ways I couldn't previously imagine.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    title: 'Micro-Frontends',
    description:
      'Developing strategies for implementing and scaling micro-frontend approaches in enterprise apps.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
];

function ValuesSectionView() {
  return (
    <section className="v2-about-values" aria-labelledby="values-title">
      <h2 id="values-title" className="v2-about-values__title">
        What I Believe
      </h2>

      <div className="v2-about-values__grid">
        {VALUES.map((value) => (
          <article key={value.title} className="v2-about-values__card">
            <div className="v2-about-values__icon">{value.icon}</div>
            <h3 className="v2-about-values__card-title">{value.title}</h3>
            <p className="v2-about-values__card-description">{value.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default pipeline(memo)(ValuesSectionView);

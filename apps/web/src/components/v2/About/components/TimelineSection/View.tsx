import clsx from 'clsx';
import { memo } from 'react';

import { pipeline } from '@/utils/pipeline';

import type { TimelineItem } from '../../types';

const TIMELINE: TimelineItem[] = [
  {
    year: '2023',
    title: 'Senior Software Engineer, Design Technologist',
    organization: 'Charter Communications (Spectrum)',
    achievements: [
      'Architected a graph database/service infrastructure solution to model complex dependency relationships across distributed microfrontend systems',
      'Developed a comprehensive system auditing tool to convert internal package source code into ASTs, enabling granular dependency tracking, identifying architectural vulnerabilities, version conflicts, and deprecated dependency usage',
      'Optimized Gitlab CI/CD pipelines using multi-stage Docker images and distributed caching strategies',
      'Led technical workstream to refactor internal SAAS sales dashboard for full mobile and tablet responsiveness while ensuring WCAG 2.0 compliance',
      'Leading R&D prototypes for Spectrum platforms.'
    ],
    current: true
  },
  {
    year: '2021',
    title: 'Software Development Engineer',
    organization: 'Amazon',
    achievements: [
      'Built synthetic monitoring tooling',
      'Rearchitected EU payment compliance flows for Amazon Games E-Commerce Detail Pages',
      'Integrated digital delivery of Amazon Games products through Amazon.com Detail Pages',
      'Pioneered the advancement of Microfrontends in Amazon Games E-Commerce Detail Pages',
      'Founded the Gotham Design System/Component Libraries used by Amazon Prime Gaming, Amazon Prime Video, Amazon Games.'
    ]
  },
  {
    year: '2021',
    title: 'Associate Software Engineer',
    organization: 'Infosys Limited',
    achievements: [
      'Developed event-driven architecture for telecom service disconnect processes automation at CenturyLink.'
    ]
  },
  {
    year: '2020',
    title: 'Lead Mobile App Developer',
    organization: 'Intuily, Inc.',
    achievements: ['Architected serverless mobile app with AWS AppSync, Lambda, and SageMaker.']
  }
];

function TimelineSectionView() {
  return (
    <section className="v2-about-timeline" aria-labelledby="timeline-title">
      <h2 id="timeline-title" className="v2-about-timeline__title">
        Experience
      </h2>

      <div className="v2-about-timeline__list">
        {TIMELINE.map((item, index) => (
          <article
            key={`${item.year}-${item.organization}`}
            className={clsx('v2-about-timeline__item', item.current && 'v2-about-timeline__item--current')}
          >
            <div className="v2-about-timeline__marker">
              <span className="v2-about-timeline__dot" />
              {index < TIMELINE.length - 1 && <span className="v2-about-timeline__line" />}
            </div>
            <div className="v2-about-timeline__content">
              <span className="v2-about-timeline__year">{item.year}</span>
              <h3 className="v2-about-timeline__role">
                {item.title}
                {item.current && <span className="v2-about-timeline__badge">Current</span>}
              </h3>
              <p className="v2-about-timeline__organization">{item.organization}</p>
              {item.achievements.length > 0 && (
                <ul style={{ listStyle: 'disc' }}>
                  {item.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default pipeline(memo)(TimelineSectionView);

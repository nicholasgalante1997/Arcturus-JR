import clsx from 'clsx';
import { memo } from 'react';

import { pipeline } from '@/utils/pipeline';

import type { TimelineItem } from '../../types';

const TIMELINE: TimelineItem[] = [
  {
    year: '2023',
    title: 'Senior Software Engineer, Design Technologist',
    organization: 'Charter Communications',
    description:
      'Architecting graph databases, building real-time systems, and leading R&D prototypes for Spectrum platforms.',
    current: true
  },
  {
    year: '2021',
    title: 'Software Development Engineer',
    organization: 'Amazon Games',
    description:
      'Built synthetic monitoring, EU payment compliance flows, and founded the Gotham Design System.'
  },
  {
    year: '2021',
    title: 'Associate Software Engineer',
    organization: 'Infosys Limited',
    description: 'Developed event-driven architecture for telecom service automation at CenturyLink.'
  },
  {
    year: '2020',
    title: 'Lead Mobile App Developer',
    organization: 'Intuily, Inc.',
    description: 'Architected serverless mobile app with AWS AppSync, Lambda, and SageMaker.'
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
              <p className="v2-about-timeline__description">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default pipeline(memo)(TimelineSectionView);

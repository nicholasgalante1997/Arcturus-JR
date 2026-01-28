import clsx from 'clsx';
import { memo } from 'react';

import { pipeline } from '@/utils/pipeline';

import type { SkillItem } from '../../types';

const SKILLS: SkillItem[] = [
  { name: 'JavaScript', category: 'Languages', proficiency: 'expert' },
  { name: 'TypeScript', category: 'Languages', proficiency: 'expert' },
  { name: 'Rust', category: 'Languages', proficiency: 'expert' },
  { name: 'Go', category: 'Languages', proficiency: 'expert' },
  { name: 'Python', category: 'Languages', proficiency: 'advanced' },
  { name: 'Java', category: 'Languages', proficiency: 'advanced' },
  { name: 'Zig', category: 'Languages', proficiency: 'advanced' },
  { name: 'C', category: 'Languages', proficiency: 'advanced' },
  { name: 'Kotlin', category: 'Languages', proficiency: 'advanced' },
  { name: 'Web Development with ES6, HTML, CSS', category: 'Frontend', proficiency: 'expert' },
  { name: 'React', category: 'Frontend', proficiency: 'expert' },
  { name: 'React Native', category: 'Frontend', proficiency: 'expert' },
  { name: 'Angular', category: 'Frontend', proficiency: 'advanced' },
  { name: 'HTMX', category: 'Frontend', proficiency: 'advanced' },
  { name: 'Style Dictionary', category: 'Frontend', proficiency: 'expert' },
  { name: 'Tailwind', category: 'Frontend', proficiency: 'expert' },
  { name: 'Bun', category: 'Backend', proficiency: 'expert' },
  { name: 'Node.js', category: 'Backend', proficiency: 'expert' },
  { name: 'Express.js', category: 'Backend', proficiency: 'expert' },
  { name: 'Nest.js', category: 'Backend', proficiency: 'expert' },
  { name: 'Spring Boot', category: 'Backend', proficiency: 'expert' },
  { name: 'Actix Web', category: 'Backend', proficiency: 'expert' },
  { name: 'Axum', category: 'Backend', proficiency: 'expert' },
  { name: 'Gin', category: 'Backend', proficiency: 'expert' },
  { name: 'Neo4j', category: 'Databases', proficiency: 'expert' },
  { name: 'PostgreSQL', category: 'Databases', proficiency: 'expert' },
  { name: 'SQLite', category: 'Databases', proficiency: 'expert' },
  { name: 'mySQL', category: 'Databases', proficiency: 'expert' },
  { name: 'Redis', category: 'Databases', proficiency: 'advanced' },
  { name: 'Kafka', category: 'Databases', proficiency: 'advanced' },
  { name: 'Docker', category: 'Infrastructure', proficiency: 'expert' },
  { name: 'Podman', category: 'Infrastructure', proficiency: 'expert' },
  { name: 'Kubernetes', category: 'Infrastructure', proficiency: 'expert' },
  { name: 'AWS', category: 'Infrastructure', proficiency: 'expert' },
  { name: 'GCP', category: 'Infrastructure', proficiency: 'expert' },
  { name: 'CI/CD', category: 'Infrastructure', proficiency: 'expert' },
  { name: 'GraphQL', category: 'APIs', proficiency: 'expert' },
  { name: 'WebSockets', category: 'APIs', proficiency: 'expert' },
  { name: 'REST', category: 'APIs', proficiency: 'expert' },
  { name: 'gRPC', category: 'APIs', proficiency: 'expert' },
  { name: 'JSON-RPC2.0', category: 'APIs', proficiency: 'expert' }
];

const CATEGORIES = [...new Set(SKILLS.map((s) => s.category))];

function SkillsSectionView() {
  return (
    <section className="v2-about-skills" aria-labelledby="skills-title">
      <h2 id="skills-title" className="v2-about-skills__title">
        Skills & Technologies
      </h2>
      <p className="v2-about-skills__description">Technologies I work with daily and continue to explore</p>

      <div className="v2-about-skills__grid">
        {CATEGORIES.map((category) => (
          <div key={category} className="v2-about-skills__category">
            <h3 className="v2-about-skills__category-title">{category}</h3>
            <ul className="v2-about-skills__list">
              {SKILLS.filter((s) => s.category === category).map((skill) => (
                <li
                  key={skill.name}
                  className={clsx(
                    'v2-about-skills__item',
                    skill.proficiency && `v2-about-skills__item--${skill.proficiency}`
                  )}
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default pipeline(memo)(SkillsSectionView);

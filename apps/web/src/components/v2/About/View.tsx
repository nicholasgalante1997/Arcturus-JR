import { memo } from 'react';
import { Link } from 'react-router';

import config from '@/config/config';
import copy from '@/content/en.json';
import { formatMessage } from '@/utils/formatMessage';
import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

const { about } = copy;

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

function V2AboutPageView() {
  return (
    <div className="v2-about-page v2-about-editorial">
      <div className="wrapper">
        <header className="v2-about-intro">
          <p className="v2-about-eyebrow">{about.hero.eyebrow}</p>
          <h1>{about.hero.title}</h1>
          <p className="v2-about-intro__lead">{about.hero.introduction}</p>
          <p className="v2-about-intro__role">{about.hero.role}</p>
          <p className="v2-about-intro__availability">{about.hero.availability}</p>
          <div className="v2-about-actions" aria-label={about.profileLinksLabel}>
            <Link className="v2-about-button v2-about-button--primary" to="/contact">
              {about.hero.contactLabel}
            </Link>
            <ExternalLink href={config.LINKS.GITHUB}>{about.hero.githubLabel}</ExternalLink>
            <ExternalLink href={config.LINKS.LINKEDIN}>{about.hero.linkedinLabel}</ExternalLink>
          </div>
        </header>

        <nav className="v2-about-index" aria-label={about.navigationLabel}>
          <span>{about.navigationLabel}</span>
          <ol>
            {about.navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div>
          <section id="selected-work" className="v2-about-section">
            <header className="v2-about-section__header">
              <p className="v2-about-section__kicker">{about.sectionLabels.work}</p>
              <h2>{about.selectedWork.title}</h2>
              <p>{about.selectedWork.introduction}</p>
            </header>

            <div className="v2-about-projects">
              {about.selectedWork.projects.map((project) => (
                <article key={project.name} className="v2-about-project">
                  <div className="v2-about-project__identity">
                    <span>{project.index}</span>
                    <p>{project.context}</p>
                  </div>
                  <div className="v2-about-project__body">
                    <h3>
                      {project.href ? (
                        <ExternalLink href={project.href}>{project.name}</ExternalLink>
                      ) : (
                        project.name
                      )}
                    </h3>
                    <p className="v2-about-project__claim">{project.claim}</p>
                    <p className="v2-about-project__description">{project.description}</p>
                    <ul
                      className="v2-about-evidence"
                      aria-label={formatMessage(about.evidenceLabel, { name: project.name })}
                    >
                      {project.evidence.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className="v2-about-project__technology">{project.technologies}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="experience" className="v2-about-section">
            <header className="v2-about-section__header">
              <p className="v2-about-section__kicker">{about.sectionLabels.history}</p>
              <h2>{about.experience.title}</h2>
              <p>{about.experience.introduction}</p>
            </header>
            <div className="v2-about-experience">
              {about.experience.roles.map((role) => (
                <article key={`${role.organization}-${role.period}`}>
                  <time>{role.period}</time>
                  <div>
                    <h3>{role.role}</h3>
                    <p className="v2-about-experience__organization">{role.organization}</p>
                    <p>{role.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="technical-range" className="v2-about-section">
            <header className="v2-about-section__header">
              <p className="v2-about-section__kicker">{about.sectionLabels.range}</p>
              <h2>{about.technicalRange.title}</h2>
              <p>{about.technicalRange.introduction}</p>
            </header>
            <div className="v2-about-range">
              {about.technicalRange.groups.map((group) => (
                <article key={group.title}>
                  <h3>{group.title}</h3>
                  <p>{group.items.join(' · ')}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="how-i-engineer" className="v2-about-section">
            <header className="v2-about-section__header">
              <p className="v2-about-section__kicker">{about.sectionLabels.principles}</p>
              <h2>{about.principles.title}</h2>
              <p>{about.principles.introduction}</p>
            </header>
            <div className="v2-about-principles">
              {about.principles.items.map((principle, index) => (
                <article key={principle.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="v2-about-section">
            <header className="v2-about-section__header">
              <p className="v2-about-section__kicker">{about.sectionLabels.index}</p>
              <h2>{about.experiments.title}</h2>
              <p>{about.experiments.introduction}</p>
            </header>
            <div className="v2-about-experiments">
              {about.experiments.projects.map((project) => (
                <article key={project.name}>
                  <h3>
                    {project.href ? (
                      <ExternalLink href={project.href}>{project.name}</ExternalLink>
                    ) : (
                      project.name
                    )}
                  </h3>
                  <p>{project.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="elsewhere" className="v2-about-section v2-about-elsewhere">
            <header className="v2-about-section__header">
              <p className="v2-about-section__kicker">{about.sectionLabels.elsewhere}</p>
              <h2>{about.elsewhere.title}</h2>
            </header>
            <div>
              {about.elsewhere.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="v2-about-closing" aria-labelledby="about-closing-title">
            <h2 id="about-closing-title">{about.closing.title}</h2>
            <p>{about.closing.description}</p>
            <div className="v2-about-actions">
              <Link className="v2-about-button v2-about-button--primary" to="/contact">
                {about.closing.contactLabel}
              </Link>
              <ExternalLink href={config.LINKS.GITHUB}>{about.closing.githubLabel}</ExternalLink>
              <ExternalLink href={config.LINKS.LINKEDIN}>{about.closing.linkedinLabel}</ExternalLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default pipeline(memo, withProfiler('v2_About_Page_View'))(V2AboutPageView);

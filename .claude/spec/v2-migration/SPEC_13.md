# SPEC-13: V2 About Page

## Context

This spec implements the V2 About page with author bio, skills/technologies showcase, timeline/experience section, and optional call-to-action. This page establishes credibility and provides personal context.

## Prerequisites

- SPEC-01 through SPEC-09 completed (layout and components ready)
- Design tokens and void components available
- Static content strategy defined

## Requirements

### 1. About Page Types

Create `apps/web/src/components/v2/About/types.ts`:

```typescript
export interface V2AboutViewProps {
  // Static page - no queries needed
}

export interface SkillItem {
  name: string;
  category: string;
  proficiency?: "expert" | "advanced" | "intermediate";
}

export interface TimelineItem {
  year: string;
  title: string;
  organization: string;
  description: string;
  current?: boolean;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}
```

### 2. Hero Section Component

Create `apps/web/src/components/v2/About/components/AboutHero/View.tsx`:

```tsx
import { memo } from "react";

import { pipeline } from "@/utils/pipeline";

function AboutHeroView() {
  return (
    <section className="v2-about-hero">
      <div className="v2-about-hero__content">
        <div className="v2-about-hero__image-container">
          <img
            src="/images/avatar.jpg"
            alt="Profile photo"
            className="v2-about-hero__image"
          />
          <div className="v2-about-hero__image-glow" aria-hidden="true" />
        </div>
        <div className="v2-about-hero__text">
          <h1 className="v2-about-hero__title">
            Hi, I'm <span className="v2-about-hero__name">Nick</span>
          </h1>
          <p className="v2-about-hero__subtitle">
            Software Engineer & Technical Writer
          </p>
          <p className="v2-about-hero__bio">
            I build performant web applications and write about software
            architecture, distributed systems, and the craft of engineering. With
            over a decade of experience, I focus on creating scalable solutions
            that solve real problems.
          </p>
          <div className="v2-about-hero__actions">
            <a href="/contact" className="void-button void-button--primary">
              Get in touch
            </a>
            <a
              href="https://github.com"
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
```

### 3. Skills Section Component

Create `apps/web/src/components/v2/About/components/SkillsSection/View.tsx`:

```tsx
import { memo } from "react";
import clsx from "clsx";

import { pipeline } from "@/utils/pipeline";
import type { SkillItem } from "../../types";

const SKILLS: SkillItem[] = [
  { name: "TypeScript", category: "Languages", proficiency: "expert" },
  { name: "React", category: "Frontend", proficiency: "expert" },
  { name: "Node.js", category: "Backend", proficiency: "expert" },
  { name: "Go", category: "Languages", proficiency: "advanced" },
  { name: "PostgreSQL", category: "Databases", proficiency: "advanced" },
  { name: "Redis", category: "Databases", proficiency: "advanced" },
  { name: "Kubernetes", category: "Infrastructure", proficiency: "advanced" },
  { name: "AWS", category: "Cloud", proficiency: "advanced" },
  { name: "GraphQL", category: "APIs", proficiency: "advanced" },
  { name: "Docker", category: "Infrastructure", proficiency: "expert" },
  { name: "Rust", category: "Languages", proficiency: "intermediate" },
  { name: "Python", category: "Languages", proficiency: "advanced" },
];

const CATEGORIES = [...new Set(SKILLS.map((s) => s.category))];

function SkillsSectionView() {
  return (
    <section className="v2-about-skills" aria-labelledby="skills-title">
      <h2 id="skills-title" className="v2-about-skills__title">
        Skills & Technologies
      </h2>
      <p className="v2-about-skills__description">
        Technologies I work with daily and continue to explore
      </p>

      <div className="v2-about-skills__grid">
        {CATEGORIES.map((category) => (
          <div key={category} className="v2-about-skills__category">
            <h3 className="v2-about-skills__category-title">{category}</h3>
            <ul className="v2-about-skills__list">
              {SKILLS.filter((s) => s.category === category).map((skill) => (
                <li
                  key={skill.name}
                  className={clsx(
                    "v2-about-skills__item",
                    skill.proficiency &&
                      `v2-about-skills__item--${skill.proficiency}`
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
```

### 4. Timeline Section Component

Create `apps/web/src/components/v2/About/components/TimelineSection/View.tsx`:

```tsx
import { memo } from "react";
import clsx from "clsx";

import { pipeline } from "@/utils/pipeline";
import type { TimelineItem } from "../../types";

const TIMELINE: TimelineItem[] = [
  {
    year: "2023",
    title: "Principal Engineer",
    organization: "Acme Corp",
    description:
      "Leading architecture decisions and mentoring engineers on distributed systems.",
    current: true,
  },
  {
    year: "2020",
    title: "Senior Software Engineer",
    organization: "Tech Startup",
    description:
      "Built core platform services handling millions of requests per day.",
  },
  {
    year: "2017",
    title: "Software Engineer",
    organization: "Enterprise Co",
    description:
      "Developed customer-facing applications and internal tooling.",
  },
  {
    year: "2014",
    title: "Junior Developer",
    organization: "Agency",
    description:
      "Started career building websites and learning fundamentals.",
  },
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
            className={clsx(
              "v2-about-timeline__item",
              item.current && "v2-about-timeline__item--current"
            )}
          >
            <div className="v2-about-timeline__marker">
              <span className="v2-about-timeline__dot" />
              {index < TIMELINE.length - 1 && (
                <span className="v2-about-timeline__line" />
              )}
            </div>
            <div className="v2-about-timeline__content">
              <span className="v2-about-timeline__year">{item.year}</span>
              <h3 className="v2-about-timeline__role">
                {item.title}
                {item.current && (
                  <span className="v2-about-timeline__badge">Current</span>
                )}
              </h3>
              <p className="v2-about-timeline__organization">
                {item.organization}
              </p>
              <p className="v2-about-timeline__description">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default pipeline(memo)(TimelineSectionView);
```

### 5. Values Section Component

Create `apps/web/src/components/v2/About/components/ValuesSection/View.tsx`:

```tsx
import { memo } from "react";

import { pipeline } from "@/utils/pipeline";

const VALUES = [
  {
    title: "Simplicity",
    description:
      "Complex problems deserve simple solutions. I strive for clarity in code and architecture.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Reliability",
    description:
      "Systems should be dependable. I focus on resilience, testing, and operational excellence.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="2" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Continuous Learning",
    description:
      "Technology evolves rapidly. I stay curious and embrace new ideas while respecting proven patterns.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
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
            <p className="v2-about-values__card-description">
              {value.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default pipeline(memo)(ValuesSectionView);
```

### 6. About Page View Component

Create `apps/web/src/components/v2/About/View.tsx`:

```tsx
import { memo } from "react";

import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";
import AboutHeroView from "./components/AboutHero/View";
import SkillsSectionView from "./components/SkillsSection/View";
import TimelineSectionView from "./components/TimelineSection/View";
import ValuesSectionView from "./components/ValuesSection/View";

function V2AboutPageView() {
  return (
    <div className="v2-about-page">
      <div className="v2-container">
        <AboutHeroView />
        <ValuesSectionView />
        <SkillsSectionView />
        <TimelineSectionView />
      </div>
    </div>
  );
}

export default pipeline(memo, withProfiler("v2_About_Page_View"))(V2AboutPageView);
```

### 7. About Page Container

Create `apps/web/src/components/v2/About/Component.tsx`:

```tsx
import { memo } from "react";

import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";

import V2AboutPageView from "./View";

function V2AboutPage() {
  // Static page - no data fetching needed
  return <V2AboutPageView />;
}

export default pipeline(withProfiler("v2_About_Page"), memo)(V2AboutPage);
```

### 8. About Page Styles

Create `apps/web/public/css/pages/v2-about.css`:

```css
/**
 * V2 About Page Styles
 */

.v2-about-page {
  padding: var(--void-spacing-8) 0 var(--void-spacing-16);
}

/* Hero Section */
.v2-about-hero {
  padding: var(--void-spacing-8) 0 var(--void-spacing-16);
}

.v2-about-hero__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--void-spacing-8);
  text-align: center;
}

@media (min-width: 768px) {
  .v2-about-hero__content {
    flex-direction: row;
    text-align: left;
    gap: var(--void-spacing-12);
  }
}

.v2-about-hero__image-container {
  position: relative;
  flex-shrink: 0;
}

.v2-about-hero__image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--void-color-gray-800);
}

@media (min-width: 768px) {
  .v2-about-hero__image {
    width: 250px;
    height: 250px;
  }
}

.v2-about-hero__image-glow {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--void-color-brand-violet),
    var(--void-color-brand-azure)
  );
  filter: blur(40px);
  opacity: 0.3;
  z-index: -1;
}

.v2-about-hero__text {
  max-width: 600px;
}

.v2-about-hero__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--void-color-base-white);
  margin-bottom: var(--void-spacing-2);
}

.v2-about-hero__name {
  background: linear-gradient(
    135deg,
    var(--void-color-brand-violet),
    var(--void-color-brand-azure)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.v2-about-hero__subtitle {
  font-size: 1.25rem;
  color: var(--void-color-gray-400);
  margin-bottom: var(--void-spacing-4);
}

.v2-about-hero__bio {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--void-color-gray-300);
  margin-bottom: var(--void-spacing-6);
}

.v2-about-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--void-spacing-3);
  justify-content: center;
}

@media (min-width: 768px) {
  .v2-about-hero__actions {
    justify-content: flex-start;
  }
}

/* Values Section */
.v2-about-values {
  padding: var(--void-spacing-12) 0;
  border-top: var(--void-border-width-thin) solid var(--void-color-gray-900);
}

.v2-about-values__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--void-color-base-white);
  text-align: center;
  margin-bottom: var(--void-spacing-10);
}

.v2-about-values__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--void-spacing-6);
}

@media (min-width: 768px) {
  .v2-about-values__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.v2-about-values__card {
  padding: var(--void-spacing-6);
  background-color: var(--void-color-gray-950);
  border: var(--void-border-width-thin) solid var(--void-color-gray-900);
  border-radius: var(--void-border-radius-lg);
  text-align: center;
}

.v2-about-values__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: var(--void-spacing-4);
  color: var(--void-color-brand-violet);
  background-color: rgba(139, 92, 246, 0.15);
  border-radius: var(--void-border-radius-lg);
}

.v2-about-values__card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--void-color-base-white);
  margin-bottom: var(--void-spacing-2);
}

.v2-about-values__card-description {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--void-color-gray-400);
  margin: 0;
}

/* Skills Section */
.v2-about-skills {
  padding: var(--void-spacing-12) 0;
  border-top: var(--void-border-width-thin) solid var(--void-color-gray-900);
}

.v2-about-skills__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--void-color-base-white);
  text-align: center;
  margin-bottom: var(--void-spacing-2);
}

.v2-about-skills__description {
  font-size: 1.125rem;
  color: var(--void-color-gray-400);
  text-align: center;
  margin-bottom: var(--void-spacing-10);
}

.v2-about-skills__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--void-spacing-8);
}

@media (min-width: 768px) {
  .v2-about-skills__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .v2-about-skills__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.v2-about-skills__category-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--void-color-gray-500);
  margin-bottom: var(--void-spacing-3);
}

.v2-about-skills__list {
  display: flex;
  flex-direction: column;
  gap: var(--void-spacing-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.v2-about-skills__item {
  font-size: 0.9375rem;
  color: var(--void-color-gray-300);
  padding-left: var(--void-spacing-4);
  position: relative;
}

.v2-about-skills__item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--void-color-gray-700);
}

.v2-about-skills__item--expert::before {
  background-color: var(--void-color-brand-violet);
}

.v2-about-skills__item--advanced::before {
  background-color: var(--void-color-brand-azure);
}

.v2-about-skills__item--intermediate::before {
  background-color: var(--void-color-gray-500);
}

/* Timeline Section */
.v2-about-timeline {
  padding: var(--void-spacing-12) 0;
  border-top: var(--void-border-width-thin) solid var(--void-color-gray-900);
}

.v2-about-timeline__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--void-color-base-white);
  text-align: center;
  margin-bottom: var(--void-spacing-10);
}

.v2-about-timeline__list {
  max-width: 700px;
  margin: 0 auto;
}

.v2-about-timeline__item {
  display: flex;
  gap: var(--void-spacing-4);
}

.v2-about-timeline__marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 24px;
}

.v2-about-timeline__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--void-color-gray-700);
  border: 2px solid var(--void-color-gray-900);
  flex-shrink: 0;
}

.v2-about-timeline__item--current .v2-about-timeline__dot {
  background-color: var(--void-color-brand-violet);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
}

.v2-about-timeline__line {
  width: 2px;
  flex: 1;
  background-color: var(--void-color-gray-800);
  margin: var(--void-spacing-2) 0;
}

.v2-about-timeline__content {
  padding-bottom: var(--void-spacing-8);
}

.v2-about-timeline__year {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--void-color-brand-azure);
}

.v2-about-timeline__role {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--void-color-base-white);
  margin: var(--void-spacing-1) 0;
  display: flex;
  align-items: center;
  gap: var(--void-spacing-2);
}

.v2-about-timeline__badge {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--void-spacing-1) var(--void-spacing-2);
  background-color: rgba(139, 92, 246, 0.15);
  color: var(--void-color-brand-violet);
  border-radius: var(--void-border-radius-full);
}

.v2-about-timeline__organization {
  font-size: 1rem;
  color: var(--void-color-gray-400);
  margin-bottom: var(--void-spacing-2);
}

.v2-about-timeline__description {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--void-color-gray-500);
  margin: 0;
}
```

### 9. Component Exports

Create `apps/web/src/components/v2/About/index.ts`:

```typescript
export { default as V2AboutPage } from "./Component";
export type { SkillItem, TimelineItem, SocialLink } from "./types";
```

## Acceptance Criteria

- [ ] Hero section displays photo, name, title, and bio
- [ ] Values section shows 3 core principles with icons
- [ ] Skills grid organized by category
- [ ] Proficiency levels indicated visually
- [ ] Timeline shows career progression
- [ ] Current position highlighted
- [ ] Action buttons link correctly
- [ ] Responsive at all breakpoints
- [ ] Static page prerenders without queries
- [ ] Accessible with proper heading hierarchy

## Notes

- This is a static page with no data fetching
- Content is hardcoded but structured for easy updates
- Skills/timeline data can be moved to CMS if needed
- Profile image should be optimized and cached
- Glow effect adds visual interest without distraction
- Timeline uses CSS for connecting line visual
- Values section demonstrates personality/philosophy

## Verification

```bash
# Build and test
bun run build
bun run serve
# Navigate to http://localhost:4200/about
# Verify all sections render
# Test responsive layout
# Check all links work
```

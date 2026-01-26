import { memo } from 'react';

import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import AboutHeroView from './components/AboutHero/View';
import SkillsSectionView from './components/SkillsSection/View';
import TimelineSectionView from './components/TimelineSection/View';
import ValuesSectionView from './components/ValuesSection/View';

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

export default pipeline(memo, withProfiler('v2_About_Page_View'))(V2AboutPageView);

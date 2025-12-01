import { memo } from 'react';

import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import { V2HeroWidget } from './components/HeroWidget';

function V2HomePageView() {
  return (
    <section className="container home-page">
      <V2HeroWidget />
    </section>
  );
}

export default pipeline(memo, withProfiler('v2_Home_Page_View'))(V2HomePageView) as React.MemoExoticComponent<
  typeof V2HomePageView
>;

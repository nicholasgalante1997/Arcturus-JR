import { memo } from 'react';

import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import V2HeroWidgetView from './View';

function V2HeroWidget() {
  return <V2HeroWidgetView />;
}

export default pipeline(withProfiler('v2_Home_HeroWidget'), memo)(V2HeroWidget) as React.MemoExoticComponent<
  typeof V2HeroWidget
>;

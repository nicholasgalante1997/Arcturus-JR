import React, { memo } from 'react';

import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import V2HomePageView from './View';

function V2HomePage() {
  return <V2HomePageView />;
}

export default pipeline(withProfiler('v2_Home_Page'), memo)(V2HomePage) as React.MemoExoticComponent<
  typeof V2HomePage
>;

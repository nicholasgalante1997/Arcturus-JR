import React from 'react';

import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import StarfieldView from './View';

function Starfield() {
  return <StarfieldView />;
}

export default pipeline(React.memo, withProfiler('Starfield'))(Starfield);

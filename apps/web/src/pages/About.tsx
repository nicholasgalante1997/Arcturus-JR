import { BASE_V1_CSS } from '@arcjr/types';
import React from 'react';

import { About } from '@/components/About';
import { AppLayout } from '@/layout/Layout';
import { toLinkMarkup } from '@/utils/css';
import { pipeline } from '@/utils/pipeline';

function AboutPage() {
  return (
    <AppLayout>
      {BASE_V1_CSS.map(toLinkMarkup)}
      <About />
    </AppLayout>
  );
}

export default pipeline(React.memo)(AboutPage);

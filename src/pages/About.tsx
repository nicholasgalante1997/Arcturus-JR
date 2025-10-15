import React from 'react';

import { About } from '@/components/About';
import { AppLayout } from '@/layout/Layout';
import { pipeline } from '@/utils/pipeline';

function AboutPage() {
  return (
    <AppLayout>
      <About />
    </AppLayout>
  );
}

export default pipeline(React.memo)(AboutPage);

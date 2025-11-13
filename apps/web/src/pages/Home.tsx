import { BASE_V1_CSS } from '@arcjr/types';
import React from 'react';

import { Home } from '@/components/Home';
import { AppLayout } from '@/layout/Layout';
import { toLinkMarkup } from '@/utils/css';

function HomePage() {
  return (
    <AppLayout>
      {BASE_V1_CSS.map(toLinkMarkup)}
      <Home />
    </AppLayout>
  );
}

export default React.memo(HomePage);

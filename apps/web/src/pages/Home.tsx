import React from 'react';

import { Home } from '@/components/Home';
import { AppLayout } from '@/layout/Layout';

function HomePage() {
  return (
    <AppLayout>
      <Home />
    </AppLayout>
  );
}

export default React.memo(HomePage);

import React from 'react';
import AppLayout from '@/layout/Layout';
import { Home } from '@/components/Home';

function HomePage() {
  return (
    <AppLayout>
      <Home />
    </AppLayout>
  );
}

export default React.memo(HomePage);

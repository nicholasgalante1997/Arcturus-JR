import React from 'react';
import AppLayout from '@/layout/Layout';
import { AboutPage } from '@/components/About';

function HomePage() {
  return (
    <AppLayout>
      <AboutPage />
    </AppLayout>
  );
}

export default React.memo(HomePage);

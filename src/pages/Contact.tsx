import React from 'react';
import AppLayout from '@/layout/Layout';
import { ContactPage } from '@/components/Contact';

function HomePage() {
  return (
    <AppLayout>
      <ContactPage />
    </AppLayout>
  );
}

export default React.memo(HomePage);

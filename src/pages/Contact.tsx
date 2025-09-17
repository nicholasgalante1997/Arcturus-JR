import React from 'react';

import { ContactPage } from '@/components/Contact';
import AppLayout from '@/layout/Layout';

function HomePage() {
  return (
    <AppLayout>
      <ContactPage />
    </AppLayout>
  );
}

export default React.memo(HomePage);

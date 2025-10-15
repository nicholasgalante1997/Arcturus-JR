import React from 'react';

import { Contact } from '@/components/Contact';
import { AppLayout } from '@/layout/Layout';
import { pipeline } from '@/utils/pipeline';

function ContactPage() {
  return (
    <AppLayout>
      <Contact />
    </AppLayout>
  );
}

export default pipeline(React.memo)(ContactPage);

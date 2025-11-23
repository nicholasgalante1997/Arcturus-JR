import React from 'react';

import { Contact } from '@/components/Contact';
import { AppLayout } from '@/layout/Layout';
import { pipeline } from '@/utils/pipeline';

function ContactPage() {
  return (
    <AppLayout>
      <link rel="preload" as="style" href="/css/contact.min.css" precedence="high" />
      <link rel="stylesheet" href="/css/contact.min.css" precedence="high" />
      <Contact />
    </AppLayout>
  );
}

export default pipeline(React.memo)(ContactPage);

import { BASE_V1_CSS } from '@arcjr/types';
import React from 'react';

import { Contact } from '@/components/Contact';
import { AppLayout } from '@/layout/Layout';
import { toLinkMarkup } from '@/utils/css';
import { pipeline } from '@/utils/pipeline';

function ContactPage() {
  return (
    <AppLayout>
      {BASE_V1_CSS.map(toLinkMarkup)}
      <link rel="preload" as="style" href="/css/contact.min.css" precedence="high" />
      <link rel="stylesheet" href="/css/contact.min.css" precedence="high" />
      <Contact />
    </AppLayout>
  );
}

export default pipeline(React.memo)(ContactPage);

import React from 'react';

import { Ciphers } from '@/components/Ciphers';
import { default as V2AppLayout } from '@/layout/v2/AppLayout';

function CiphersPage() {
  return (
    <V2AppLayout>
      <link rel="preload" as="style" href="/css/ciphers.min.css" precedence="high" />
      <link rel="stylesheet" href="/css/ciphers.min.css" precedence="high" />
      <Ciphers />
    </V2AppLayout>
  );
}

export default React.memo(CiphersPage);

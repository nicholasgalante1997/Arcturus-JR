import React from 'react';

import { Cipher } from '@/components/Ciphers/Cipher';
import { default as V2AppLayout } from '@/layout/v2/AppLayout';

function CipherPage() {
  return (
    <V2AppLayout>
      <link rel="preload" as="style" href="/css/ciphers.min.css" precedence="high" />
      <link rel="stylesheet" href="/css/ciphers.min.css" precedence="high" />
      <Cipher />
    </V2AppLayout>
  );
}

export default React.memo(CipherPage);

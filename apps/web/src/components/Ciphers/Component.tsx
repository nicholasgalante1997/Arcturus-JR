import React from 'react';

import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useGetCiphers } from '@/hooks/useCiphers';

import CiphersView from './View';

function CiphersComponent() {
  const ciphersQuery = useGetCiphers();
  return (
    <SuspenseEnabledQueryProvider>
      <CiphersView queries={[ciphersQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default React.memo(CiphersComponent);

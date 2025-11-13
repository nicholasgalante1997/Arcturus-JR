import React from 'react';
import { useParams } from 'react-router';

import { SuspenseEnabledQueryProvider } from '@/components/Base';
import { useGetCipher } from '@/hooks/useCipher';

import CipherView from './View';

function Cipher() {
  const { id } = useParams<{ id: string }>();
  const cipherQuery = useGetCipher(id!, { enabled: !!id });

  return (
    <SuspenseEnabledQueryProvider>
      <CipherView queries={[cipherQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default React.memo(Cipher);

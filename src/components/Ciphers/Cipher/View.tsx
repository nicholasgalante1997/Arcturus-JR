import React, { use } from 'react';

import type { CipherViewProps } from './types';

function CipherView({ queries }: CipherViewProps) {
  const [cipherQuery] = queries;
  const cipher = use(cipherQuery.promise);

  return (
    <div>
      <h1>{cipher.readable_name}</h1>
      <pre>{cipher.cipher_text}</pre>
    </div>
  );
}

export default React.memo(CipherView);

import React, { use } from 'react';

import type { CipherViewProps } from './types';

function CipherView({ queries }: CipherViewProps) {
  const [cipherQuery] = queries;
  const cipher = use(cipherQuery.promise);

  return (
    <section className="void-theme" id="ciphers-page___container">
      <p id="cipher-name">{cipher.readable_name}</p>
      <pre id="ciphertext">{cipher.cipher_text}</pre>
    </section>
  );
}

export default React.memo(CipherView);

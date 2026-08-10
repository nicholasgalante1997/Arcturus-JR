import React, { use, useState } from 'react';
import { Link } from 'react-router';

import copy from '@/content/en.json';

import type { CipherViewProps } from './types';

const { ciphers: cipherCopy } = copy;

function CipherView({ queries }: CipherViewProps) {
  const [cipherQuery] = queries;
  const cipher = use(cipherQuery.promise);
  const [copied, setCopied] = useState(false);

  const copyCiphertext = async (): Promise<void> => {
    await navigator.clipboard.writeText(cipher.cipher_text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="cipher-detail">
      <div className="wrapper">
        <header className="cipher-detail__header">
          <Link className="cipher-detail__back" to="/ee/ciphers">
            <span aria-hidden="true">&#8592;</span> {cipherCopy.backLabel}
          </Link>
          <p className="cipher-eyebrow">{cipherCopy.transmissionLabel}</p>
          <h1>{cipher.readable_name}</h1>
          <code>{cipher.cipher_name}</code>
        </header>

        <section className="cipher-transmission" aria-labelledby="ciphertext-title">
          <div className="cipher-transmission__toolbar">
            <h2 id="ciphertext-title">{cipherCopy.transmissionLabel}</h2>
            <button type="button" onClick={copyCiphertext}>
              {copied ? cipherCopy.copiedLabel : cipherCopy.copyLabel}
            </button>
          </div>
          <pre id="ciphertext" tabIndex={0}>
            {cipher.cipher_text}
          </pre>
        </section>
      </div>
    </div>
  );
}

export default React.memo(CipherView);

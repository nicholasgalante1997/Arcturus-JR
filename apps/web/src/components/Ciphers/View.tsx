import React, { use } from 'react';
import { Link } from 'react-router';

import copy from '@/content/en.json';

import type { CiphersViewProps } from './types';

const { ciphers: cipherCopy } = copy;

function CiphersView({ queries }: CiphersViewProps) {
  const [ciphersQuery] = queries;
  const ciphers = use(ciphersQuery.promise);

  return (
    <div className="cipher-archive">
      <div className="wrapper">
        <header className="cipher-archive__header">
          <p className="cipher-eyebrow">{cipherCopy.eyebrow}</p>
          <h1>{cipherCopy.title}</h1>
          <p className="cipher-archive__introduction">{cipherCopy.introduction}</p>
          <p className="cipher-archive__challenge">{cipherCopy.challenge}</p>
        </header>

        <section className="cipher-registry" aria-label={cipherCopy.archiveLabel}>
          {ciphers.map((cipher, index) => (
            <article key={cipher.cipher_name} className="cipher-record">
              <div className="cipher-record__identity">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h2>
                  <Link to={`/ee/cipher/${cipher.cipher_name}`}>{cipher.readable_name}</Link>
                </h2>
                <code>{cipher.cipher_name}</code>
              </div>

              <div className="cipher-record__estimates">
                <p>{cipherCopy.estimateLabel}</p>
                <dl>
                  <div>
                    <dt>{cipherCopy.noviceLabel}</dt>
                    <dd>{cipher.estimated_completion_time.novice}</dd>
                  </div>
                  <div>
                    <dt>{cipherCopy.intermediateLabel}</dt>
                    <dd>{cipher.estimated_completion_time.intermediate}</dd>
                  </div>
                  <div>
                    <dt>{cipherCopy.expertLabel}</dt>
                    <dd>{cipher.estimated_completion_time.expert}</dd>
                  </div>
                </dl>
              </div>

              <Link className="cipher-record__action" to={`/ee/cipher/${cipher.cipher_name}`}>
                {cipherCopy.openLabel} <span aria-hidden="true">&#8594;</span>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

export default CiphersView;

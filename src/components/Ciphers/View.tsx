import React, { use } from 'react';

import { VoidCard } from '../Base/Themes/Void';

import type { CiphersViewProps } from './types';

function CiphersView({ queries }: CiphersViewProps) {
  const [ciphersQuery] = queries;
  const ciphers = use(ciphersQuery.promise);

  return (
    <section className="void-theme" id="ciphers-page___container">
      <h2>ciphertexts</h2>
      <p>
        <i>Congratulations</i> You have found an easter egg. Can you find any more?
      </p>
      <div id="ciphers-page___cipher-card-grid">
        {ciphers.map((cipher) => (
          <VoidCard
            key={cipher.cipher_name}
            className="ciphers-page___card"
            title={cipher.readable_name}
            subtitle={null}
            body={
              <ul>
                <li>
                  <i>Novice:</i>&nbsp;
                  <b style={{ color: 'var(--void-azure)' }}>{cipher.estimated_completion_time.novice}</b>
                </li>
                <li>
                  <i>Black Ops III Enthusiast</i>&nbsp;
                  <b style={{ color: 'var(--void-amber)' }}>
                    {cipher.estimated_completion_time.intermediate}
                  </b>
                </li>
                <li>
                  <i>Herbert Yardley</i>&nbsp;
                  <b style={{ color: 'var(--void-rose)' }}>{cipher.estimated_completion_time.expert}</b>
                </li>
              </ul>
            }
            action={{
              href: `/ee/cipher/${cipher.cipher_name}`,
              label: 'View Ciphertext',
              _preferReactRouterLink: true,
              target: '_self'
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default CiphersView;

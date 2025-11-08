import React, { use } from 'react';

import { VoidCard } from '../Base/Themes/Void';

import type { CiphersViewProps } from './types';

function CiphersView({ queries }: CiphersViewProps) {
  const [ciphersQuery] = queries;
  const ciphers = use(ciphersQuery.promise);
  console.log('CiphersView Rendered with ciphers:', ciphers);

  return (
    <React.Fragment>
      {/* Ciphers Page Specific CSS */}
      <link rel="preload" as="stylesheet" href="/css/ciphers.css" precedence="low" />
      <link rel="stylesheet" href="/css/ciphers.css" precedence="high" />

      {/* Markup */}
      <section id="ciphers-page___container">
        {ciphers.map((cipher) => (
          <VoidCard
            key={cipher.cipher_name}
            title={cipher.readable_name}
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            body={<span>placeholder</span>}
            action={{
              href: `/ee/cipher/${cipher.cipher_name}`,
              label: 'View Ciphertext',
              _preferReactRouterLink: true,
              target: '_self'
            }}
          />
        ))}
      </section>
    </React.Fragment>
  );
}

export default CiphersView;

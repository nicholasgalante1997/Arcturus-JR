import React from 'react';

import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useMarkdown } from '@/hooks/useMarkdown';
import { pipeline } from '@/utils/pipeline';

import ContactView from './View';

function Contact() {
  const markdownQuery = useMarkdown('/content/contact.md');
  return (
    <SuspenseEnabledQueryProvider>
      <ContactView queries={[markdownQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(React.memo)(Contact);

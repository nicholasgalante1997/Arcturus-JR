import React from 'react';

import { DQUI } from '@/components/Base/DeferredQueryUI';
import { useMarkdown } from '@/hooks/useMarkdown';
import { pipeline } from '@/utils/pipeline';

import ContactView from './View';

function Contact() {
  const markdownQuery = useMarkdown('/content/contact.md');
  return (
    <DQUI q={markdownQuery}>
      <ContactView markdown={markdownQuery.data?.markdown || ''} />
    </DQUI>
  );
}

export default pipeline(React.memo)(Contact);

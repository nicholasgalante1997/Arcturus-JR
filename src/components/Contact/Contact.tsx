import React from 'react';
import { Markdown } from '@/components/Markdown';
import { useMarkdown } from '@/hooks/useMarkdown';
import { DQUI } from '../DeferredQueryUI';

function Contact() {
  const $md = useMarkdown('/content/contact.md');
  return (
    <DQUI q={$md}>
      <div className="markdown-content">
        <Markdown markdown={$md.data?.markdown || ''} />
      </div>
    </DQUI>
  );
}

export default React.memo(Contact);
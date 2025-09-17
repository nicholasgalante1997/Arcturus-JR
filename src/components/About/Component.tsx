import React, { useEffect, useState } from 'react';

import { DQUI } from '@/components/DeferredQueryUI';
import { useMarkdown } from '@/hooks/useMarkdown';
import { useTypewriterAnimation } from '@/hooks/useTypewriterAnimation';
import { pipeline } from '@/utils/pipeline';

import AboutView from './View';

function About() {
  const [markdownMounted, setMarkdownMounted] = useState(false);
  const $md = useMarkdown('/content/about.md');

  useEffect(() => {
    if ($md.data && !markdownMounted) {
      setMarkdownMounted(true);
    }
  }, [$md.data, markdownMounted]);

  useTypewriterAnimation({ enabled: markdownMounted, element: document.querySelector('h1.about-hero-text') });

  return (
    <DQUI q={$md}>
      <AboutView markdown={$md?.data?.markdown || ''} />
    </DQUI>
  );
}

export default pipeline(React.memo)(About);

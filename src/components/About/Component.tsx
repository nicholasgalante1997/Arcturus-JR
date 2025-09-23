import React from 'react';

import { DQUI } from '@/components/Base/DeferredQueryUI';
import { useMarkdown } from '@/hooks/useMarkdown';
import { useTypewriterAnimation } from '@/hooks/useTypewriterAnimation';
import { pipeline } from '@/utils/pipeline';

import { useAboutMarkdownMounted } from './hooks/useAboutMarkdownMounted';
import AboutView from './View';

function About() {
  const markdownQuery = useMarkdown('/content/about.md');
  const { mounted } = useAboutMarkdownMounted({ query: markdownQuery });
  const element: HTMLHeadingElement | null = mounted ? document.querySelector('h1.about-hero-text') : null;
  useTypewriterAnimation({ enabled: mounted, element });
  return (
    <DQUI q={markdownQuery}>
      <AboutView markdown={markdownQuery.data?.markdown || ''} />
    </DQUI>
  );
}

export default pipeline(React.memo)(About);

import React, { useEffect, useState } from 'react';
import { runTypewriterAnimation } from '@/animation';
import { DQUI } from '@/components/DeferredQueryUI';
import { Markdown } from '@/components/Markdown';
import { useMarkdown } from '@/hooks/useMarkdown';

function About() {
  const [markdownMounted, setMarkdownMounted] = useState(false);
  const [animationTimeoutRef, setAnimationTimeoutRef] = useState<NodeJS.Timeout | null>(null);
  const $md = useMarkdown('/content/about.md');

  useEffect(() => {
    if ($md.data) {
      setMarkdownMounted(true);
    }
  }, [$md.data]);

  useEffect(() => {
    if (markdownMounted) {
      const element: HTMLHeadingElement | null = window.document.querySelector('h1.about-hero-text');
      if (element && !animationTimeoutRef) {
        const timeout = setTimeout(() => {
          runTypewriterAnimation(element);
        }, 400);
        setAnimationTimeoutRef(timeout);
      }
    }
  }, [markdownMounted, animationTimeoutRef]);

  return (
    <DQUI q={$md}>
      <div className="markdown-content">
        <Markdown markdown={$md.data?.markdown || ''} />
      </div>
    </DQUI>
  );
}

export default React.memo(About);

import React from 'react';
import { Markdown } from '@/components/Markdown';
import { useMarkdown } from '@/hooks/useMarkdown';

function About() {
  const {
    data: markdownData,
    isLoading: markdownIsLoading,
    error: markdownError
  } = useMarkdown('/content/home.md');
  return <div className="markdown-content">{}</div>;
}

export default React.memo(About);

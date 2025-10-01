import { memo, use } from 'react';

import { Markdown } from '@/components/Base/Markdown';
import { pipeline } from '@/utils/pipeline';

import { AboutViewProps } from './types';

function AboutView({ queries }: AboutViewProps) {
  const [_markdown] = queries;
  const markdown = use(_markdown.promise);
  return (
    <div className="markdown-content">
      <Markdown markdown={markdown.markdown} />
    </div>
  );
}

export default pipeline(memo)(AboutView) as React.MemoExoticComponent<React.ComponentType<AboutViewProps>>;

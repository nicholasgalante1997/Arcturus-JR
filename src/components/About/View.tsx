import { memo } from 'react';

import Markdown from '@/components/Markdown/Markdown';
import { pipeline } from '@/utils/pipeline';

import { AboutViewProps } from './types';

function AboutView({ markdown }: AboutViewProps) {
  return (
    <div className="markdown-content">
      <Markdown markdown={markdown} />
    </div>
  );
}

export default pipeline(memo)(AboutView) as React.MemoExoticComponent<React.ComponentType<AboutViewProps>>;

import { memo, use } from 'react';

import { Markdown } from '@/components/Base/Markdown';
import { pipeline } from '@/utils/pipeline';

import { ContactViewProps } from './types';

function ContactView({ queries }: ContactViewProps) {
  const [_markdown] = queries;
  const markdown = use(_markdown.promise);
  return (
    <div className="markdown-content">
      <Markdown markdown={markdown.markdown} />
    </div>
  );
}

export default pipeline(memo)(ContactView) as React.MemoExoticComponent<
  React.ComponentType<ContactViewProps>
>;

import { memo } from 'react';

import { Markdown } from '@/components/Base/Markdown';
import { pipeline } from '@/utils/pipeline';

import { ContactViewProps } from './types';

function ContactView({ markdown }: ContactViewProps) {
  return (
    <div className="markdown-content">
      <Markdown markdown={markdown} />
    </div>
  );
}

export default pipeline(memo)(ContactView) as React.MemoExoticComponent<
  React.ComponentType<ContactViewProps>
>;

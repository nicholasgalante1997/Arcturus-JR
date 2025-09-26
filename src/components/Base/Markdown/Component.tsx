import React from 'react';

import { pipeline } from '@/utils/pipeline';

import MarkdownView from './View';

function Markdown({ markdown }: { markdown: string }) {
  return <MarkdownView markdown={markdown} />;
}

export default pipeline(React.memo)(Markdown) as React.MemoExoticComponent<typeof Markdown>;

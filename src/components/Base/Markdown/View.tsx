import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import { pipeline } from '@/utils/pipeline';

import { modifiedSanitizationSchema } from './utils/rehype-sanitize';
import { MarkdownViewProps } from './types';

function MarkdownView({ markdown }: MarkdownViewProps) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw, [rehypeSanitize, modifiedSanitizationSchema]]}
      remarkPlugins={[remarkGfm]}
    >
      {markdown}
    </ReactMarkdown>
  );
}

export default pipeline(memo)(MarkdownView) as React.MemoExoticComponent<
  React.ComponentType<MarkdownViewProps>
>;

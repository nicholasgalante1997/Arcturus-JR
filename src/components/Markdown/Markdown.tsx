import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import { modifiedSanitizationSchema } from './utils/rehype-sanitize';

function Markdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw, [rehypeSanitize, modifiedSanitizationSchema]]}
      remarkPlugins={[remarkGfm]}
      
    >
      {markdown}
    </ReactMarkdown>
  );
}

export default React.memo(Markdown);

import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import dockerfile from 'react-syntax-highlighter/dist/esm/languages/prism/docker';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { CodeComponentProps } from './types';

// Register the languages with SyntaxHighlighter
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', bash); // alias
SyntaxHighlighter.registerLanguage('sh', bash); // alias
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('yml', yaml); // alias
SyntaxHighlighter.registerLanguage('dockerfile', dockerfile);

// Language mapping for aliases and common variations
const languageMap: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  rs: 'rust',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  'c++': 'cpp',
  dockerfile: 'dockerfile',
  docker: 'dockerfile',
  md: 'markdown',
  html: 'markup',
  xml: 'markup'
};

// List of supported languages (for validation)
const supportedLanguages = new Set([
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'rust',
  'zig',
  'css',
  'json',
  'bash',
  'python',
  'sql',
  'yaml',
  'toml',
  'dockerfile',
  'go',
  'c',
  'cpp',
  'java',
  'php',
  'ruby',
  'markup',
  'markdown'
]);

const CodeComponent: React.FC<CodeComponentProps> = ({ inline, className, children, ...props }) => {
  // Extract language from className
  const match = /language-(\w+)/.exec(className || '');
  const language = match?.[1]?.toLowerCase();
  const actualLanguage = language ? languageMap[language] || language : undefined;
  const shouldHighlight = !inline && actualLanguage && supportedLanguages.has(actualLanguage);

  if (shouldHighlight) {
    return (
      <SyntaxHighlighter
        style={atomDark}
        language={actualLanguage}
        PreTag="div"
        showLineNumbers={false} // Set to true if you want line numbers
        wrapLines={true}
        customStyle={{
          margin: 0,
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '1.5'
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default CodeComponent;

import fm from 'front-matter';

export interface MarkdownDocument {
  markdown: string;
  fm: ReturnType<typeof fm>;
}

export function isMarkdownDocument(obj: unknown): obj is MarkdownDocument {
  if (typeof obj !== 'object' || obj === null) return false;
  const doc = obj as MarkdownDocument;
  const hasMarkdown = !!doc.markdown;
  const hasFrontMatter = typeof doc?.fm === 'object' && doc.fm !== null;
  const hasFrontMatterBody = typeof doc?.fm?.body === 'string';
  const hasFrontMatterAttrs = typeof doc?.fm.attributes === 'object' && doc?.fm?.attributes !== null;
  return hasMarkdown && hasFrontMatter && hasFrontMatterAttrs && hasFrontMatterBody;
}

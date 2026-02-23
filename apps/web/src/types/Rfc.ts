export interface Rfc {
  id: string;
  title: string;
  version: string;
  status: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  visible: boolean;
}

export interface RfcWithContent extends Rfc {
  content: string;
}

export function isRfc(obj: unknown): obj is Rfc {
  if (typeof obj !== 'object' || obj === null) return false;
  const rfc = obj as Rfc;
  return (
    typeof rfc.id === 'string' &&
    typeof rfc.title === 'string' &&
    typeof rfc.version === 'string' &&
    typeof rfc.status === 'string' &&
    typeof rfc.date === 'string' &&
    typeof rfc.author === 'string' &&
    typeof rfc.excerpt === 'string' &&
    Array.isArray(rfc.tags) &&
    rfc.tags.every((tag) => typeof tag === 'string') &&
    typeof rfc.visible === 'boolean'
  );
}

export function isRfcWithContent(obj: unknown): obj is RfcWithContent {
  if (!isRfc(obj)) return false;
  const rfc = obj as RfcWithContent;
  return typeof rfc.content === 'string';
}

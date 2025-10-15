import CacheWithExpiry from '@/models/CacheWithExpiry';
import { MarkdownDocument } from '@/types';

export interface MarkdownStaticCaches {
  documents: CacheWithExpiry<string, MarkdownDocument>;
}

export interface IMarkdownService {
  fetchMarkdown(file: string): Promise<MarkdownDocument>;
}

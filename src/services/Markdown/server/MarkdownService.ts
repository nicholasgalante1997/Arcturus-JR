import fm from 'front-matter';
import path from 'path';

import { type MarkdownDocument } from '@/types/MarkdownDocument';

import { type IMarkdownService } from '../types';

class ServerMarkdownService implements IMarkdownService {
  /**
   * There is not really a need to cache during the prerendering process,
   * as each markdown file will only be fetched once
   */
  async fetchMarkdown(filename: string): Promise<MarkdownDocument> {
    try {
      const markdownFilePath = path.resolve(process.cwd(), 'public' + filename);
      const file = Bun.file(markdownFilePath, { type: 'text/markdown' });
      const text = await file.text();
      if (text === '') throw new Error('File is empty');
      const $fm = fm(text);
      const $markdown: MarkdownDocument = {
        markdown: $fm.body,
        fm: $fm
      };
      return $markdown;
    } catch (error) {
      console.error('Error fetching markdown:', error);
      throw error;
    }
  }
}

export default ServerMarkdownService;

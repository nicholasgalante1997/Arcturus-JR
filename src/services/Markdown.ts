import fm from 'front-matter';

import CacheWithExpiry from '@/models/CacheWithExpiry';
import { MarkdownDocument } from '@/types/MarkdownDocument';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';

interface MarkdownStaticCaches {
  documents: CacheWithExpiry<string, MarkdownDocument>;
}

export default class Markdown {
  private static __caches: MarkdownStaticCaches = {
    documents: new CacheWithExpiry<string, MarkdownDocument>()
  };

  async fetchMarkdown(file: string): Promise<MarkdownDocument> {
    /**
     * Step 0: Check the cache for the file
     * If it exists, return the cached result
     */
    if (Markdown.__caches.documents.has(file)) {
      return Markdown.__caches.documents.get(file) as MarkdownDocument;
    }

    /**
     * Step 1: Fetch the file from the server
     * and cache the result
     */
    try {
      const timeoutMs = 4000;
      const response = await fetchWithTimeout(file, this.getMarkdownFetchInit(), timeoutMs);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      if (text === '') throw new Error('File is empty');
      const $fm = fm(text);
      const $markdown = {
        markdown: $fm.body,
        fm: $fm
      };
      Markdown.__caches.documents.set(file, $markdown);
      return $markdown;
    } catch (error) {
      console.error('Error fetching markdown:', error);
      throw error;
    }
  }

  private getMarkdownFetchHeaders() {
    const headers = new Headers();
    headers.set('Accept', 'text/markdown');
    headers.set('Accept-Encoding', 'gzip, br');
    headers.set('X-Client-ID', 'minvans-swa');
    return headers;
  }

  private getMarkdownFetchInit(): RequestInit {
    const headers = this.getMarkdownFetchHeaders();
    return {
      headers,
      method: 'GET',
      mode: 'no-cors',
      credentials: 'same-origin'
    };
  }
}

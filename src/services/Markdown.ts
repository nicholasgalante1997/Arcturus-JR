import fm from 'front-matter';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';
import { MarkdownDocument } from '@/types/MarkdownDocument';

export default class Markdown {
  async fetchMarkdown(file: string): Promise<MarkdownDocument> {
    try {
      const timeoutMs = 4000;
      const response = await fetchWithTimeout(file, this.getMarkdownFetchInit(), timeoutMs);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      if (text === '') throw new Error('File is empty');
      const $fm = fm(text);
      return {
        markdown: $fm.body,
        fm: $fm
      };
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

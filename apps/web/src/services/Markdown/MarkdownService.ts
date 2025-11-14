import { type MarkdownDocument } from '@/types/MarkdownDocument';
import { getJavascriptEnvironment } from '@/utils/env';

import BrowserMarkdownService from './browser/MarkdownService';
import { IMarkdownService } from './types';

interface MarkdownState {
  initialized: boolean;
  runtime: 'browser' | 'server';
}

class Markdown implements IMarkdownService {
  private _state: MarkdownState;
  private _client: IMarkdownService | null = null;
  constructor() {
    this._state = {
      initialized: false,
      runtime: getJavascriptEnvironment()
    };
  }

  async initialize() {
    if (this._state.initialized) return;

    if (this._state.runtime === 'browser') {
      this._client = new BrowserMarkdownService();
    } else {
      const { default: ServerMarkdownService } = await import(
        /* webpackExclude: /\.(js|jsx|ts|tsx)$/ */
        './server/MarkdownService'
      );
      this._client = new ServerMarkdownService();
    }

    this._state.initialized = true;
  }

  async fetchMarkdown(file: string): Promise<MarkdownDocument> {
    if (!this._state.initialized) {
      try {
        await this.initialize();
      } catch (e) {
        console.error('Error during MarkdownService initialization:', e);
        throw e;
      }
    }

    if (this._client) {
      return this._client.fetchMarkdown(file);
    }

    throw new Error(
      'MarkdownService has not been initialized! All "fetchMarkdown" calls will be blocked until the client has been initialized.'
    );
  }
}

export default Markdown;

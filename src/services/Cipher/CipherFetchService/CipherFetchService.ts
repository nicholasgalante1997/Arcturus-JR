import BrowserCipherFetchService from './browser/CipherFetchService';

import type { CipherDTO, CipherJSON, ICipherFetchService } from './types/ICipherFetchService';

interface CipherFetchServiceState {
  initialized: boolean;
  runtime: 'browser' | 'server';
}

class CipherFetchService implements ICipherFetchService {
  private _state: CipherFetchServiceState;
  private _client: ICipherFetchService | null = null;

  constructor() {
    this._state = {
      initialized: false,
      runtime: 'server'
    };
  }

  async initialize() {
    if (this._state.initialized) return;

    if (this._state.runtime === 'browser') {
      this._client = new BrowserCipherFetchService();
    } else {
      const { default: ServerCipherFetchService } = await import(
        /* webpackExclude: /\.(js|jsx|ts|tsx)$/ */
        './server/CipherFetchService'
      );
      this._client = new ServerCipherFetchService();
    }

    this._state.initialized = true;
  }

  fetchCipherTextsIndex(): Promise<Array<CipherJSON>> {
    if (this._state.initialized) {
      if (this._client) {
        return this._client.fetchCipherTextsIndex();
      }

      throw new Error('RootCipherFetchService: missing client');
    }

    throw new Error('RootCipherFetchService: was not initalized leading to error state.');
  }

  fetchCipherText(cipher_name: string): Promise<CipherDTO> {
    if (this._state.initialized) {
      if (this._client) {
        return this._client.fetchCipherText(cipher_name);
      }

      throw new Error('RootCipherFetchService: missing client');
    }

    throw new Error('RootCipherFetchService: was not initalized leading to error state.');
  }
}

export default CipherFetchService;
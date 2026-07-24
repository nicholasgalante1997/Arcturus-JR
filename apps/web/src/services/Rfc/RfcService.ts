import { getJavascriptEnvironment } from '@/utils/env';

import BrowserRfcService from './browser/RfcService';
import { IRfcService } from './types';

import type { Rfc, RfcWithContent } from '@/types/Rfc';

interface RfcState {
  initialized: boolean;
  runtime: 'browser' | 'server';
}

class RfcService implements IRfcService {
  private _state: RfcState;
  private _client: IRfcService | null = null;

  constructor() {
    this._state = {
      initialized: false,
      runtime: getJavascriptEnvironment()
    };
  }

  async initialize(): Promise<void> {
    if (this._state.initialized) return;

    if (this._state.runtime === 'browser') {
      this._client = new BrowserRfcService();
    } else {
      const { default: ServerRfcService } = await import(
        /* webpackExclude: /\.(js|jsx|ts|tsx)$/ */
        './server/RfcService'
      );
      this._client = new ServerRfcService();
    }

    this._state.initialized = true;
  }

  async fetchRfcs(): Promise<Array<Rfc>> {
    if (!this._state.initialized) {
      try {
        await this.initialize();
      } catch (e) {
        console.error('Error during RfcService initialization:', e);
        throw e;
      }
    }

    if (this._client) {
      return this._client.fetchRfcs();
    }

    throw new Error('RfcService _client is not initialized!');
  }

  async fetchRfc(id: string): Promise<RfcWithContent> {
    if (!this._state.initialized) {
      try {
        await this.initialize();
      } catch (e) {
        console.error('Error during RfcService initialization:', e);
        throw e;
      }
    }

    if (this._client) {
      return this._client.fetchRfc(id);
    }

    throw new Error('RfcService _client is not initialized!');
  }
}

export default RfcService;

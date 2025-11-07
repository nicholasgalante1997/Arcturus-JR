import { fetchWithTimeout } from '@/utils/fetchWithTimeout';
import { jlog } from '@/utils/log';

import type {
  BrowserCipherFetchServiceInternalCache,
  CipherDTO,
  CipherJSON,
  ICipherFetchService
} from '../types/ICipherFetchService';

class BrowserCipherFetchService implements ICipherFetchService {
  private static cache: BrowserCipherFetchServiceInternalCache = {
    ciphers_index: [],
    cipher_texts: new Map<string, string>()
  };

  private static __endpoints = {
    ciphers_index: '/ciphers.json',
    cipher_by_id: '/ciphertexts'
  };

  async fetchCipherTextsIndex(): Promise<Array<CipherJSON>> {
    if (BrowserCipherFetchService.cache.ciphers_index) {
      return BrowserCipherFetchService.cache.ciphers_index;
    }

    try {
      const response = await fetchWithTimeout(BrowserCipherFetchService.__endpoints.ciphers_index, {
        cache: 'default',
        method: 'GET',
        mode: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, br',
          'X-Client-ID': 'minvans-swa'
        }
      });

      const cipherDTOs = (await response.json()) as Array<CipherJSON>;

      BrowserCipherFetchService.cache.ciphers_index = cipherDTOs;

      return cipherDTOs;
    } catch (e: unknown) {
      jlog.label('browser-cipher-fetch-service:error');
      jlog('An error occurred while fetching cipher texts index:', e);
      jlog.unlabel();

      throw e;
    }
  }

  async fetchCipherText(cipher_name: string): Promise<CipherDTO> {
    if (
      !BrowserCipherFetchService.cache.ciphers_index ||
      BrowserCipherFetchService.cache.ciphers_index.length === 0
    ) {
      await this.fetchCipherTextsIndex();
    }

    const cipher_dto = BrowserCipherFetchService.cache.ciphers_index?.find(
      ({ cipher_name: item_cipher_name }) => item_cipher_name === cipher_name
    );

    if (!cipher_dto) {
      throw new Error(`Missing cipher ${cipher_name}`);
    }

    try {
      if (BrowserCipherFetchService.cache.cipher_texts.has(cipher_name)) {
        const cached_cipher_text = BrowserCipherFetchService.cache.cipher_texts.get(cipher_name);
        if (cached_cipher_text) {
          return {
            ...cipher_dto,
            cipher_text: cached_cipher_text
          };
        }
      }

      const ciphertext_request = await fetchWithTimeout(
        BrowserCipherFetchService.__endpoints.cipher_by_id + `/${cipher_name}.txt`,
        {
          cache: 'default',
          method: 'GET',
          mode: 'same-origin',
          headers: {
            Accept: 'text/plain',
            'Accept-Encoding': 'gzip, br',
            'X-Client-ID': 'minvans-swa'
          }
        }
      );

      const ciphertext = await ciphertext_request.text();
      BrowserCipherFetchService.cache.cipher_texts.set(cipher_name, ciphertext);

      return {
        ...cipher_dto,
        cipher_text: ciphertext
      };
    } catch (e) {
      jlog.label('browser-cipher-fetch-service-error');
      jlog('An error occurred while fetching cipher text:', e);
      jlog.unlabel();

      throw e;
    }
  }
}

export default BrowserCipherFetchService;

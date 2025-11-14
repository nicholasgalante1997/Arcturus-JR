import path from 'path';

import { jlog } from '@/utils/log';

import type { CipherDTO, CipherJSON, ICipherFetchService } from '../types/ICipherFetchService';

class ServerCipherFetchService implements ICipherFetchService {
  async fetchCipherTextsIndex(): Promise<Array<CipherJSON>> {
    try {
      const ciphers_json_path = path.resolve(process.cwd(), 'public', 'ciphertexts', 'ciphers.json');
      const ciphers_json = await Bun.file(ciphers_json_path, { type: 'application/json' }).json();
      return ciphers_json as Array<CipherJSON>;
    } catch (e: unknown) {
      jlog.label('server-cipher-fetch-service:error');
      jlog('An error occurred while fetching cipher texts index:', e);
      jlog.unlabel();

      throw e;
    }
  }

  async fetchCipherText(cipher_name: string): Promise<CipherDTO> {
    const ciphers_json = await this.fetchCipherTextsIndex();

    const cipher_dto = ciphers_json.find(
      ({ cipher_name: item_cipher_name }) => item_cipher_name === cipher_name
    );

    if (!cipher_dto) {
      throw new Error(`Missing cipher ${cipher_name}`);
    }

    try {
      const ciphertext_path = path.resolve(process.cwd(), 'public', 'ciphertexts', `${cipher_name}.txt`);
      const ciphertext = await Bun.file(ciphertext_path).text();
      return {
        ...cipher_dto,
        cipher_text: ciphertext
      };
    } catch (e) {
      jlog.label('server-cipher-fetch-service-error');
      jlog('An error occurred while fetching cipher text:', e);
      jlog.unlabel();

      throw e;
    }
  }
}

export default ServerCipherFetchService;

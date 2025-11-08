import _ciphers from '@public/ciphertexts/ciphers.json';

import { CipherJSON } from '@/services/Cipher/CipherFetchService/types/ICipherFetchService';

export const ciphers = _ciphers as Array<CipherJSON>;

export const cipher_slugs = ciphers.map((cipher) => cipher.cipher_name);

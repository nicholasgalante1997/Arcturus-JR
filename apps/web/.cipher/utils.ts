import debug from 'debug';
import { rm } from 'fs/promises';
import path from 'path';

import AgnosticKeyCipher from '@/models/AgnosticCipher';

import type { CipherMetadata, CipherOptions, CreateCipherMetadataOptions } from './types';

const log = debug('arc:cipher');

export async function cipher({ input, output, cipher_keyfile, estimated_completion_times }: CipherOptions) {
  if (!input || !output || !cipher_keyfile) {
    log.extend('error')('Missing [%s, %s]', input, cipher_keyfile);
    throw new Error('Missing Cipher [Input, Output, CipherKey].');
  }

  log('Starting cipher for file %s', input);

  const eciphers = await getCiphersJson();

  if (eciphers === null) {
    log.extend('error')('Missing ciphers.json file [%s]', eciphers);
    throw new Error('Unable to load ciphers.json');
  }

  try {
    /**
     * Try and load the plaintext file
     */
    log('Loading plaintext file...');
    const file = Bun.file(path.resolve(process.cwd(), '.cipher', 'plaintexts', input));
    const plaintext = await file.text();

    log('Plaintext\n', plaintext);

    /**
     * Try and load the cipher key
     */
    let cipher_key = null;

    const mjs_regex = new RegExp(/[\d\w_\-0-9]*\.(m)?js/gm);
    const ts_regex = new RegExp(/[\d\w_\-0-9]*\.ts/gm);

    if (mjs_regex.test(cipher_keyfile) || ts_regex.test(cipher_keyfile)) {
      const { default: cipher_key_module } = await import(`./keys/${cipher_keyfile}`);

      if (AgnosticKeyCipher.isCipherKey(cipher_key_module)) {
        cipher_key = cipher_key_module;
      } else if ('atob' in cipher_key_module && 'btoa' in cipher_key_module) {
        cipher_key = AgnosticKeyCipher.createCipherKey(cipher_key_module.atob, cipher_key_module.btoa);
      } else {
        cipher_key = AgnosticKeyCipher.createCipherKey(cipher_key_module);
      }
    } else {
      const map = await Bun.file(path.resolve(process.cwd(), '.cipher', 'keys', cipher_keyfile)).json();
      cipher_key = AgnosticKeyCipher.createCipherKey(map);
    }

    if (cipher_key == null) {
      console.error(`Unable to load cipherkey from: ${cipher_keyfile}`);
      throw new Error('Unable to load cipher key.');
    }

    const cipher = new AgnosticKeyCipher(cipher_key);

    const ciphertext = cipher.encrypt(plaintext);

    log('ciphertext\n', ciphertext);

    /**
     * Write the cipher file
     */
    await Bun.write(path.resolve(process.cwd(), '.cipher', 'ciphertexts', output), String(ciphertext), {
      createPath: true
    });

    /**
     * Add the cipher to the array of ciphers so it can be tracked
     */

    eciphers.push(
      createCipherMetadataObject({
        name: output.replace('.txt', ''),
        estimated_completion_time: [
          estimated_completion_times.novice,
          estimated_completion_times.intermediate,
          estimated_completion_times.expert
        ]
      })
    );

    const ciphers_jsonfile = path.resolve(process.cwd(), '.cipher', 'ciphers.json');

    try {
      await rm(ciphers_jsonfile);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      log.extend('warn')('Did not remove ./ciphers.json');
    }

    await Bun.write(ciphers_jsonfile, JSON.stringify(eciphers), { createPath: true });
  } catch (e) {
    console.error(e);
    await cleanup(output);
    process.exit(1);
  }
}

export function onSuccess(start: number) {
  log('Cipher completed entirely in %dms', performance.now() - start);
}

export function onError(error: unknown) {
  log.extend('error')(error);
  process.exit(1);
}

async function cleanup(output: string) {
  try {
    await rm(output!);
  } catch (e) {
    console.warn('Unable to cleanup output', e);
  }
}

async function getCiphersJson(): Promise<CipherMetadata[] | null> {
  const paths = [
    path.resolve(process.cwd(), 'public', 'ciphers.json'),
    path.resolve(process.cwd(), '.cipher', 'ciphers.json')
  ];

  while (paths.length) {
    const ciphers_path = paths.shift();
    try {
      const ciphers_file = Bun.file(ciphers_path!);
      const ciphers_json = await ciphers_file.json();
      if (ciphers_json) return ciphers_json;
    } catch (e) {
      console.warn('Unable to find ciphers.json in ', ciphers_path);
      console.warn(e);
      continue;
    }
  }

  return null;
}

function createCipherMetadataObject({
  name,
  estimated_completion_time
}: CreateCipherMetadataOptions): CipherMetadata {
  return {
    cipher_name: name,
    readable_name: name
      .split('_')
      .map((word) => word.toUpperCase())
      .join(' '),
    estimated_completion_time: {
      novice: estimated_completion_time[0],
      intermediate: estimated_completion_time[1],
      expert: estimated_completion_time[2]
    }
  };
}

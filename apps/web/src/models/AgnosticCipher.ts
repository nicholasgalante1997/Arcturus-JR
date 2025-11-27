import { CipherEncryptionOptionsOutputFormat, SYMBOL_FOR_CIPHER_KEY_MAP } from '@/types/Ciphers';
import { coerceString } from '@/utils/string';

import ASCII from './ASCII';

import type {
  Cipher,
  CipherEncryptionOptions,
  CipherInputTypeConstraints,
  CipherKey,
  CipherOutputTypeConstraints
} from '@/types/Ciphers';

/**
 * Agnostic Key Cipher Class
 *
 * A cipher utility that should be able to be instantiated with any arbitrary cipher key,
 * that fits the `CipherKey` interface, and use the supplied CipherKey to implement it's encrypt, and decrypt functions.
 *
 * It's core characteristic is that the implementation details of the cipher_key:CipherKey can be abstracted away from the class instance,
 * meaning the AgnosticKeyCipher instance does not need to know the specific of the I/O Transformations
 *
 * */
class AgnosticKeyCipher<
  Input extends CipherInputTypeConstraints,
  Output extends CipherOutputTypeConstraints
> implements Cipher<Input, Output> {
  /**
   * A valid SubstitutionMap should satisfy the following constraints,
   * - It is a record
   * - It translates the chars: [a-zA-Z0-9] into:
   *    - Any valid utf-8 string
   *    - Any valid number or float
   * - It may, but is not required to, provide a transformation to special characters
   *
   * @tests
   */
  static isSubstitutionMap(value: unknown): value is Record<string | number, string | number | Uint8Array> {
    if (typeof value !== 'object') return false;
    if (value === null) return false;
    return Object.entries(value).every(([key, kvalue]) => {
      const keyType = typeof key;
      if (!['string', 'number'].includes(keyType)) {
        return false;
      }

      const valueType = typeof kvalue;
      const isStringOrNumber = ['string', 'number'].includes(valueType);
      const isUint8Array = kvalue instanceof Uint8Array;
      return isStringOrNumber || isUint8Array;
    });
  }

  /**
   * @tests
   */
  static isCipherKey<ICKInput extends string = string, ICKOutput = string>(
    value: unknown
  ): value is CipherKey<ICKInput, ICKOutput> {
    if (typeof value !== 'function') return false;
    const ck = value as CipherKey<ICKInput, ICKOutput>;
    if (typeof ck.__inverse !== 'function') return false;
    if (typeof ck.__getSymbolForCipherKeyMap !== 'function') return false;
    if (ck.__getSymbolForCipherKeyMap() !== SYMBOL_FOR_CIPHER_KEY_MAP) return false;
    return true;
  }

  /**
   * @tests
   */
  static createCipherKey<
    CKInput extends string | number = string,
    CKOutput = string,
    CKSubstitutionMapping extends Record<CKInput, CKOutput> = Record<CKInput, CKOutput>
  >(map: CKSubstitutionMapping): CipherKey<CKInput, CKOutput>;

  /**
   * @tests
   */
  static createCipherKey<
    CKInput extends string | number = string,
    CKOutput = string,
    CKSubstitutionMapping extends Record<CKInput, CKOutput> = Record<CKInput, CKOutput>
  >(
    atob: (input: CKInput) => CKOutput,
    btoa: (output: CKOutput) => CKInput,
    map?: CKSubstitutionMapping
  ): CipherKey<CKInput, CKOutput>;

  /**
   * @tests
   */
  static createCipherKey<
    CKInput extends string | number = string,
    CKOutput = string,
    CKSubstitutionMapping extends Record<CKInput, CKOutput> = Record<CKInput, CKOutput>
  >(...args: unknown[]): CipherKey<CKInput, CKOutput> {
    if (arguments.length === 1) {
      /**
       * Check that we're working with a SubstitutionMap as our only argument
       */
      const map = args[0];

      if (!AgnosticKeyCipher.isSubstitutionMap(map)) {
        throw new Error('Invalid Cipher Substitution Map');
      }

      const ck: CipherKey<CKInput, CKOutput> = function (
        this: CipherKey<CKInput, CKOutput>,
        input: CKInput
      ): CKOutput {
        const value = map[input as keyof typeof map];
        if (typeof value === 'undefined') {
          /**
           * The character is not in the substitution map,
           * this is likely an indication that we do not want to transform it in any way
           */
          return input as unknown as CKOutput;
        }

        return value as unknown as CKOutput;
      };

      ck.__inverse = function (this: CipherKey<CKInput, CKOutput>, output: CKOutput) {
        const entries = Object.entries(map) as [CKInput, CKOutput][];
        const match = entries.find(([, v]) => v === output);
        if (match) {
          return match[0];
        }

        return output as unknown as CKInput;
      };

      ck[SYMBOL_FOR_CIPHER_KEY_MAP] = map as CKSubstitutionMapping;
      ck.__getSymbolForCipherKeyMap = () => SYMBOL_FOR_CIPHER_KEY_MAP;

      return ck;
    } else if (args.length > 1) {
      /**
       * We're working with supploed atob and btoa functions
       */
      const atob = args[0] as (input: CKInput) => CKOutput;
      const btoa = args[1] as (output: CKOutput) => CKInput;

      if (typeof atob !== 'function' || typeof btoa !== 'function') {
        throw new Error('Arguments [atob, btoa] must be valid Transform functions.');
      }

      const ck: CipherKey<CKInput, CKOutput> = atob as CipherKey<CKInput, CKOutput>;
      ck.__inverse = btoa.bind(ck);
      ck[SYMBOL_FOR_CIPHER_KEY_MAP] = null;
      ck.__getSymbolForCipherKeyMap = () => SYMBOL_FOR_CIPHER_KEY_MAP;
      return ck;
    } else {
      throw new Error('Invalid arguments to createCipherKey');
    }
  }

  private static getDefaultEncryptionOptions(
    options?: CipherEncryptionOptions
  ): Required<CipherEncryptionOptions> {
    return {
      delimiter: typeof options?.delimiter !== 'undefined' ? options.delimiter : ' ',
      includeSpecialChars: options?.includeSpecialChars ?? false,
      output: {
        format: options?.output?.format || CipherEncryptionOptionsOutputFormat.DEFAULT,
        removeWhiteSpace: !!options?.output?.removeWhiteSpace,
        removeSpecialChars: !!options?.output?.removeSpecialChars
      }
    };
  }

  private __cipher_key: CipherKey<Input, Output>;

  constructor(cipher_key: CipherKey<Input, Output>) {
    if (!AgnosticKeyCipher.isCipherKey(cipher_key)) {
      throw new Error('Invalid Cipher Key supplied to AgnosticKeyCipher');
    }

    this.__cipher_key = cipher_key;
  }

  /**
   * Works on a single character or string representation of a digit
   *
   * Uses the cipher_key provided to the instance during creation to convert a single Input into a single Output
   */
  private encrypt_char(plaintext: Input): Output {
    return this.__cipher_key(plaintext);
  }

  /**
   * Works on a single character or string representation of a digit
   *
   * Uses the __inverse property of the cipher_key object to revert an Output to its plaintext (unobfuscated) Input
   */
  private decrypt_char(cipher: Output): Input {
    return this.__cipher_key.__inverse(cipher);
  }

  /**
   * Currently, we've limited Input to type string
   * Ideally, we'd want to be able to accept an arbitrary input,
   * such as:
   *
   * - A number or BigInt
   * - An Array<number | BigInt>
   * - A Uint8Array
   *
   * What is the goal of this?
   * It takes input (string)
   *
   * and creates a ciphertext as output,
   * where: ciphertext ?=
   * - string
   * - Array<number>
   * - Array<string>
   */
  encrypt(plaintext: Input, options: CipherEncryptionOptions = {}): Output | Output[] | Output[][] | string {
    const { delimiter, includeSpecialChars, output } = AgnosticKeyCipher.getDefaultEncryptionOptions(options);

    const getDelimiter = () => (output?.removeWhiteSpace && delimiter === ' ' ? '' : delimiter);

    const phrases = plaintext.split(delimiter);

    const encrypted_char_matrix = phrases.map((phrase) => {
      const chars = phrase.split('');
      return chars
        .map((char) => {
          /**
           * If you specify that you would like to transform special characters,
           * it is expected that every character in the plaintext will have a
           * corresponding substitution.
           *
           * Failure to adhere to this principle will result in the output being corrupt
           */
          if (includeSpecialChars) {
            return this.encrypt_char(char as Input);
          }

          if (ASCII.isAlphabetChar(char) || ASCII.isNumericChar(char)) {
            return this.encrypt_char(char as Input);
          }

          if (output?.removeWhiteSpace && char === ' ') {
            return '';
          }

          /**
           * We're dealing with a special character,
           * i.e. [ '',.!>?#$%""/]
           */
          if (output?.removeSpecialChars) {
            return '';
          }

          return char as unknown as Output;
        })
        .filter((char) => {
          return char !== '' && char !== null && char !== undefined;
        });
    });

    if (output.format === CipherEncryptionOptionsOutputFormat.COERCED_ARRAY) {
      return encrypted_char_matrix.flat() as Output[];
    }

    if (output.format === CipherEncryptionOptionsOutputFormat.COERCED_STRING) {
      try {
        return encrypted_char_matrix
          .map((encrypted_phrase) =>
            encrypted_phrase.map((encrypted_char) => coerceString(encrypted_char)).join('')
          )
          .join(getDelimiter());
      } catch (e) {
        console.warn(e);
        throw new Error('Unable to coerce cipher to string, but specified output format was COERCED_STRING');
      }
    }

    if (output.format === CipherEncryptionOptionsOutputFormat.PRESERVE) {
      return encrypted_char_matrix.map((encrypted_phrase_array) =>
        encrypted_phrase_array
          .map((encrypted_char) => (encrypted_char === '' ? null : encrypted_char))
          .filter((enc_char_or_null) => enc_char_or_null !== null)
      ) as Output[][];
    }

    return encrypted_char_matrix
      .map((encrypted_phrase) =>
        encrypted_phrase.map((encrypted_char) => coerceString(encrypted_char)).join('')
      )
      .join(getDelimiter());
  }

  decrypt(ciphertext: Output, options = { delimiter: ' ' }): Input {
    if (typeof ciphertext === 'string') {
      const encrypted_phrases = ciphertext.split(options.delimiter);
      const decrypted_phrases = encrypted_phrases.map((encrypted_phrase) => {
        const chars = encrypted_phrase.split('');
        const decrypted_chars = chars.map((char) => {
          return this.decrypt_char(char as Output);
        });
        return decrypted_chars.join('');
      });

      return decrypted_phrases.join(options.delimiter) as Input;
    }

    if (ciphertext instanceof Uint8Array) {
      let decrypted = '';
      for (const num of ciphertext) {
        decrypted += this.decrypt_char(num as Output);
      }

      return decrypted as Input;
    }

    if (Array.isArray(ciphertext)) {
      if (ciphertext.length) {
        switch (typeof ciphertext[0]) {
          case 'number': {
            /** Working with an array of numbers */
            return ciphertext
              .map((num) => this.decrypt_char(num as Output))
              .map(coerceString)
              .join('') as Input;
          }
          case 'string': {
            /** Working with an array of strings */
            return ciphertext
              .map((str) =>
                typeof str === 'string'
                  ? str
                      .split('')
                      .map((char) => this.decrypt_char(char as Output))
                      .join('')
                  : str
                      .toString(10)
                      .split('')
                      .map((char) => this.decrypt_char(char as Output))
                      .join('')
              )
              .join('') as Input;
          }
        }
      }
    }

    if (typeof ciphertext === 'number') {
      return this.decrypt_char(ciphertext as Output);
    }

    throw new Error('Unrecognized encrypted format');
  }
}

export default AgnosticKeyCipher;

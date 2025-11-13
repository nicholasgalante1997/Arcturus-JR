export const SYMBOL_FOR_CIPHER_KEY_MAP = Symbol.for('arc-cipher-key-sentinel-symbol');
export const SYMBOL_FOR_CIPHER_OUTPUT_TYPE = Symbol.for('arc-cipher-key-output-type-sentinel-symbol');

export type CipherInputTypeConstraints = string;

export type CipherOutputTypeConstraints = string | number | Array<number> | Array<string> | Uint8Array;

export interface Cipher<
  Input extends CipherInputTypeConstraints = string,
  Output extends CipherOutputTypeConstraints = string
> {
  encrypt(plaintext: Input, options?: CipherEncryptionOptions): Output | Output[] | Output[][] | string;
  decrypt(cipher: Output, options?: CipherDecryptionOptions): Input;
}

export enum CipherEncryptionOptionsOutputFormat {
  DEFAULT = 'default',
  PRESERVE = 'preserve',
  COERCED_STRING = 'coerced_string',
  COERCED_ARRAY = 'coerced_array'
}

export interface CipherEncryptionOptions {
  delimiter?: string;
  includeSpecialChars?: boolean;
  output?: {
    format?: CipherEncryptionOptionsOutputFormat;
    removeWhiteSpace?: boolean;
    removeSpecialChars?: boolean;
  };
}

export interface CipherDecryptionOptions {
  delimiter?: string;
}

/**
 * Key Constraints
 *
 * - A key should operate on a single character or numeric value,
 *      not entire strings or words
 *      This way, we do not need to maintain an elaborate codebook
 *      and can instead work on a deterministic small Set of unicode values.
 *
 * - A key is only valid so long as
 *  * An input can produce the same output arbitrary times
 *  * An output can be used to derive an input,
 *      even if the mechanics are blackboxed.
 *
 *      * Addendum: To accommodate One-Way transformations (Transformations we can't undo)
 *          If we have access to an input, and an output
 */
export interface CipherKey<
  Input extends symbol | string | number = string,
  Output = string,
  SubstitutionMapping = Record<Input, Output>
> {
  (input: Input): Output;
  [SYMBOL_FOR_CIPHER_KEY_MAP]: SubstitutionMapping | null;
  __getSymbolForCipherKeyMap: () => symbol;
  __inverse(output: Output): Input;
}

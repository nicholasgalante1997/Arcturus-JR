/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, test } from 'bun:test';

import { CipherEncryptionOptionsOutputFormat } from '@/types/Ciphers';

import AgnosticKeyCipher from './AgnosticCipher';

function getLetterToNumberSubstitutionCipherKey() {
  return {
    a: 33,
    b: 34,
    c: 35,
    d: 36,
    e: 37,
    f: 38,
    g: 39,
    h: 40,
    i: 41,
    j: 42,
    k: 43,
    l: 44,
    m: 45,
    n: 46,
    o: 47,
    p: 48,
    q: 49,
    r: 50,
    s: 51,
    t: 52,
    u: 53,
    v: 54,
    w: 55,
    x: 56,
    y: 57,
    z: 58,
    A: 59,
    B: 60,
    C: 61,
    D: 62,
    E: 63,
    F: 64,
    G: 65,
    H: 66,
    I: 67,
    J: 68,
    K: 69,
    L: 70,
    M: 71,
    N: 72,
    O: 73,
    P: 74,
    Q: 75,
    R: 76,
    S: 77,
    T: 78,
    U: 79,
    V: 80,
    W: 81,
    X: 82,
    Y: 83,
    Z: 84,
    '0': 85,
    '1': 86,
    '2': 87,
    '3': 88,
    '4': 89,
    '5': 90,
    '6': 91,
    '7': 92,
    '8': 93,
    '9': 94
  };
}

function getStringToStringSubstitutionMap() {
  return { a: 'x', b: 'y', c: 'z', A: 'X', B: 'Y', C: 'Z', '1': '9', '2': '8' };
}

describe('AgnosticKeyCipher', () => {
  describe('isSubstitutionMap', () => {
    test('should return true for valid string-to-number map', () => {
      const validMap = getLetterToNumberSubstitutionCipherKey();
      expect(AgnosticKeyCipher.isSubstitutionMap(validMap)).toBeTrue();
    });

    test('should return true for valid string-to-string map', () => {
      const validMap = getStringToStringSubstitutionMap();
      expect(AgnosticKeyCipher.isSubstitutionMap(validMap)).toBeTrue();
    });

    test('should return true for valid number-to-string map', () => {
      const validMap = { 1: 'a', 2: 'b', 3: 'c' };
      expect(AgnosticKeyCipher.isSubstitutionMap(validMap)).toBeTrue();
    });

    test('should return true for valid map with Uint8Array values', () => {
      const validMap = { a: new Uint8Array([1, 2, 3]), b: new Uint8Array([4, 5, 6]) };
      expect(AgnosticKeyCipher.isSubstitutionMap(validMap)).toBeTrue();
    });

    test('should return false for null', () => {
      expect(AgnosticKeyCipher.isSubstitutionMap(null)).toBeFalse();
    });

    test('should return false for non-object types', () => {
      expect(AgnosticKeyCipher.isSubstitutionMap('string')).toBeFalse();
      expect(AgnosticKeyCipher.isSubstitutionMap(123)).toBeFalse();
      expect(AgnosticKeyCipher.isSubstitutionMap(true)).toBeFalse();
    });

    test('should return false for invalid value types', () => {
      const invalidMap = { a: null, b: undefined, c: {}, d: [] };
      expect(AgnosticKeyCipher.isSubstitutionMap(invalidMap)).toBeFalse();
    });
  });

  describe('isCipherKey', () => {
    test('should return true for valid CipherKey', () => {
      const substitutionMap = getLetterToNumberSubstitutionCipherKey();
      const cipherKey = AgnosticKeyCipher.createCipherKey<string, number>(substitutionMap);
      expect(AgnosticKeyCipher.isCipherKey(cipherKey)).toBeTrue();
    });

    test('should return false for non-function values', () => {
      expect(AgnosticKeyCipher.isCipherKey({})).toBeFalse();
      expect(AgnosticKeyCipher.isCipherKey('string')).toBeFalse();
      expect(AgnosticKeyCipher.isCipherKey(null)).toBeFalse();
    });

    test('should return false for function without required properties', () => {
      const invalidKey = () => {};
      expect(AgnosticKeyCipher.isCipherKey(invalidKey)).toBeFalse();
    });

    test('should return false for function with invalid __inverse', () => {
      const invalidKey = () => {};
      invalidKey.__inverse = 'not a function';
      invalidKey.__getSymbolForCipherKeyMap = () => Symbol.for('cipher-key-map');
      expect(AgnosticKeyCipher.isCipherKey(invalidKey)).toBeFalse();
    });
  });

  describe('createCipherKey', () => {
    test('should create CipherKey from substitution map', () => {
      const substitutionMap = getStringToStringSubstitutionMap();
      const cipherKey = AgnosticKeyCipher.createCipherKey(substitutionMap);

      expect(typeof cipherKey).toBe('function');
      expect(typeof cipherKey.__inverse).toBe('function');
      expect(typeof cipherKey.__getSymbolForCipherKeyMap).toBe('function');
      expect(cipherKey('a')).toBe('x');
      expect(cipherKey.__inverse('x')).toBe('a');
    });

    test('should create CipherKey from transform functions', () => {
      const atob = (input: string) => input.charCodeAt(0);
      const btoa = (output: number) => String.fromCharCode(output);
      const cipherKey = AgnosticKeyCipher.createCipherKey(atob, btoa);

      expect(typeof cipherKey).toBe('function');
      expect(cipherKey('a')).toBe(97);
      expect(cipherKey.__inverse(97)).toBe('a');
    });

    test('should handle unmapped characters by returning them unchanged', () => {
      const substitutionMap = { a: 'x' };
      const cipherKey = AgnosticKeyCipher.createCipherKey(substitutionMap);
      expect(cipherKey('b')).toBe('b');
    });

    test('should throw error for invalid substitution map', () => {
      expect(() => AgnosticKeyCipher.createCipherKey({ a: null } as any)).toThrow(
        'Invalid Cipher Substitution Map'
      );
    });

    test('should throw error for invalid transform functions', () => {
      expect(() =>
        AgnosticKeyCipher.createCipherKey('not a function' as any, 'also not a function' as any)
      ).toThrow('Arguments [atob, btoa] must be valid Transform functions.');
    });

    test('should throw error for no arguments', () => {
      expect(() => (AgnosticKeyCipher.createCipherKey as any)()).toThrow(
        'Invalid arguments to createCipherKey'
      );
    });
  });

  describe('constructor', () => {
    test('should create instance with valid cipher key', () => {
      const substitutionMap = getLetterToNumberSubstitutionCipherKey();
      const cipherKey = AgnosticKeyCipher.createCipherKey<string, number>(substitutionMap);
      const cipher = new AgnosticKeyCipher(cipherKey);
      expect(cipher).toBeInstanceOf(AgnosticKeyCipher);
    });

    test('should throw error with invalid cipher key', () => {
      expect(() => new AgnosticKeyCipher({} as any)).toThrow(
        'Invalid Cipher Key supplied to AgnosticKeyCipher'
      );
    });
  });

  describe('encrypt', () => {
    let cipher: AgnosticKeyCipher<string, number>;
    let stringCipher: AgnosticKeyCipher<string, string>;

    beforeEach(() => {
      const substitutionMap = getLetterToNumberSubstitutionCipherKey();
      const cipherKey = AgnosticKeyCipher.createCipherKey<string, number>(substitutionMap);
      cipher = new AgnosticKeyCipher(cipherKey);

      const stringMap = getStringToStringSubstitutionMap();
      const stringKey = AgnosticKeyCipher.createCipherKey(stringMap);
      stringCipher = new AgnosticKeyCipher(stringKey);
    });

    test('should encrypt single character', () => {
      const result = cipher.encrypt('a');
      expect(result).toBe('33 ');
    });

    test('should encrypt simple word', () => {
      const result = cipher.encrypt('abc');
      expect(result).toBe('33 34 35 ');
    });

    test('should encrypt multiple words with default delimiter', () => {
      const result = cipher.encrypt('ab cd');
      expect(result).toBe('33 34  35 36 ');
    });

    test('should encrypt with custom delimiter', () => {
      const result = cipher.encrypt('ab|cd', { delimiter: '|' });
      expect(result).toBe('33 34 |35 36 ');
    });

    test('should handle special characters by default (not encrypting them)', () => {
      const result = stringCipher.encrypt('a!b');
      expect(result).toBe('x!y');
    });

    test('should include special characters when specified', () => {
      const mapWithSpecial = { a: 'x', '!': 'EXCLAIM' };
      const key = AgnosticKeyCipher.createCipherKey(mapWithSpecial);
      const specialCipher = new AgnosticKeyCipher(key);
      const result = specialCipher.encrypt('a!', { includeSpecialChars: true });
      expect(result).toBe('xEXCLAIM');
    });

    test('should remove whitespace when specified', () => {
      const result = stringCipher.encrypt('a b', {
        output: { removeWhiteSpace: true }
      });
      expect(result).toBe('xy');
    });

    test('should remove special characters when specified', () => {
      const result = stringCipher.encrypt('a!b', {
        output: { removeSpecialChars: true }
      });
      expect(result).toBe('xy');
    });

    test('should return coerced array format', () => {
      const result = cipher.encrypt('ab', {
        output: { format: CipherEncryptionOptionsOutputFormat.COERCED_ARRAY }
      });
      expect(Array.isArray(result)).toBeTrue();
      expect(result).toEqual([33, 34]);
    });

    test('should return coerced string format', () => {
      const result = cipher.encrypt('ab', {
        output: { format: CipherEncryptionOptionsOutputFormat.COERCED_STRING }
      });
      expect(typeof result).toBe('string');
      expect(result).toBe('33 34 ');
    });

    test('should return preserve format', () => {
      const result = cipher.encrypt('ab cd', {
        output: { format: CipherEncryptionOptionsOutputFormat.PRESERVE }
      });
      expect(Array.isArray(result)).toBeTrue();
      expect(result).toEqual([
        [33, 34],
        [35, 36]
      ]);
    });

    test('should handle numbers in input', () => {
      const result = cipher.encrypt('a1b2');
      expect(result).toBe('33 86 34 87 ');
    });

    test('should handle mixed case letters', () => {
      const result = cipher.encrypt('aA');
      expect(result).toBe('33 59 ');
    });

    test('should handle Uint8Array values without throwing', () => {
      const mapWithUint8 = { a: new Uint8Array([1, 2, 3]) };
      const key = AgnosticKeyCipher.createCipherKey<string, Uint8Array>(mapWithUint8);
      const uint8Cipher = new AgnosticKeyCipher(key);

      const result = uint8Cipher.encrypt('ab', {
        output: { format: CipherEncryptionOptionsOutputFormat.COERCED_STRING }
      });
      expect(result).toBe('{"0":1,"1":2,"2":3}b');
    });
  });

  describe('decrypt', () => {
    let cipher: AgnosticKeyCipher<string, number>;
    let stringCipher: AgnosticKeyCipher<string, string>;

    beforeEach(() => {
      const substitutionMap = getLetterToNumberSubstitutionCipherKey();
      const cipherKey = AgnosticKeyCipher.createCipherKey<string, number>(substitutionMap);
      cipher = new AgnosticKeyCipher(cipherKey);

      const stringMap = getStringToStringSubstitutionMap();
      const stringKey = AgnosticKeyCipher.createCipherKey(stringMap);
      stringCipher = new AgnosticKeyCipher(stringKey);
    });

    test('should decrypt single character', () => {
      const result = stringCipher.decrypt('x');
      expect(result).toBe('a');
    });

    test('should decrypt simple word', () => {
      const result = stringCipher.decrypt('xyz');
      expect(result).toBe('abc');
    });

    test('should decrypt multiple words with default delimiter', () => {
      const result = stringCipher.decrypt('xy yz');
      expect(result).toBe('ab bc');
    });

    test('should decrypt with custom delimiter', () => {
      const result = stringCipher.decrypt('xy|yz', { delimiter: '|' });
      expect(result).toBe('ab|bc');
    });

    test('should handle unmapped characters by returning them unchanged', () => {
      const result = stringCipher.decrypt('x!y');
      expect(result).toBe('a!b');
    });

    test('should decrypt single number', () => {
      const result = cipher.decrypt(33);
      expect(result).toBe('a');
    });

    test('should decrypt Uint8Array', () => {
      const result = cipher.decrypt(new Uint8Array([33, 34, 35]));
      expect(result).toBe('abc');
    });

    test('should decrypt array of numbers', () => {
      const result = cipher.decrypt([33, 34, 35] as any);
      expect(result).toBe('abc');
    });

    test('should decrypt array of strings', () => {
      const result = stringCipher.decrypt(['x', 'y', 'z'] as any);
      expect(result).toBe('abc');
    });

    test('should throw error for empty array', () => {
      expect(() => cipher.decrypt([] as any)).toThrow('Unrecognized encrypted format');
    });

    test('should throw error for unrecognized format', () => {
      expect(() => cipher.decrypt({} as any)).toThrow('Unrecognized encrypted format');
    });

    test('should handle round-trip encryption/decryption', () => {
      const original = 'Hello World 123';
      const encrypted = stringCipher.encrypt(original);
      const decrypted = stringCipher.decrypt(encrypted as string);

      // Only alphanumeric characters should be transformed
      expect(decrypted).toBe('Hello World 123');
    });
  });

  describe('integration tests', () => {
    test('should handle complete encryption/decryption cycle with string cipher', () => {
      const stringMap = getStringToStringSubstitutionMap();
      const stringKey = AgnosticKeyCipher.createCipherKey(stringMap);
      const cipher = new AgnosticKeyCipher(stringKey);

      const plaintext = 'abc';
      const encrypted = cipher.encrypt(plaintext) as string;
      const decrypted = cipher.decrypt(encrypted);

      expect(encrypted).toBe('xyz');
      expect(decrypted).toBe('abc');
    });

    test('should work with function-based cipher keys for single characters', () => {
      const atob = (input: string) => input.toUpperCase();
      const btoa = (output: string) => output.toLowerCase();
      const cipherKey = AgnosticKeyCipher.createCipherKey(atob, btoa);
      const cipher = new AgnosticKeyCipher(cipherKey);

      const plaintext = 'a';
      const encrypted = cipher.encrypt(plaintext) as string;
      const decrypted = cipher.decrypt(encrypted);

      expect(encrypted).toBe('A');
      expect(decrypted).toBe('a');
    });

    test('should preserve special characters in encryption', () => {
      const stringMap = getStringToStringSubstitutionMap();
      const stringKey = AgnosticKeyCipher.createCipherKey(stringMap);
      const cipher = new AgnosticKeyCipher(stringKey);

      const plaintext = 'a!b@c#';
      const encrypted = cipher.encrypt(plaintext) as string;

      expect(encrypted).toBe('x!y@z#');
    });
  });
});

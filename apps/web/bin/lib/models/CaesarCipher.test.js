import { describe, test, expect } from 'bun:test';
import CaesarCipher, { CaesarCipherShiftDirection } from './CaesarCipher.js';

describe('CaesarCipher', () => {
  describe('encrypt', () => {
    test('should encrypt a simple text', () => {
      const cipher = new CaesarCipher();
      const plaintext = 'Hello, World!';
      const shift = 3;
      const expected = 'Khoor, Zruog!';
      const actual = cipher.encrypt(plaintext, shift);
      expect(actual).toBe(expected);
    });

    test('should encrypt a text with uppercase letters', () => {
        const cipher = new CaesarCipher();
        const plaintext = 'Hello, World!';
        const shift = 3;
        const expected = 'Khoor, Zruog!';
        const actual = cipher.encrypt(plaintext, shift);
        expect(actual).toBe(expected);
    });

    test('should encrypt a text with lowercase letters', () => {
        const cipher = new CaesarCipher();
        const plaintext = 'hello, world!';
        const shift = 3;
        const expected = 'khoor, zruog!';
        const actual = cipher.encrypt(plaintext, shift);
        expect(actual).toBe(expected);
    });

    test('should encrypt with a left shift', () => {
        const cipher = new CaesarCipher().setShiftLeft();
        const plaintext = 'Hello, World!';
        const shift = 3;
        const expected = "Ebiil, Tloia!";
        const actual = cipher.encrypt(plaintext, shift);
        expect(actual).toBe(expected);
    })
  });

  describe('decrypt', () => {
    test('should decrypt a simple text', () => {
        const cipher = new CaesarCipher();
        const plaintext = 'Khoor, Zruog!';
        const shift = 3;
        const expected = 'Hello, World!';
        const actual = cipher.decrypt(plaintext, shift);
        expect(actual).toBe(expected);
    });

    test('should decrypt a left shifted ciphertext', () => {
        const cipher = new CaesarCipher().setShiftLeft();
        const plaintext = "Ebiil, Tloia!";
        const shift = 3;
        const expected = 'Hello, World!';
        const actual = cipher.decrypt(plaintext, shift);
        expect(actual).toBe(expected);
    })
  });

  describe('crack', () => {
    test('Cracks a Caesar Cipher', () => {
      const cipher = new CaesarCipher().setShiftRight();
      const plaintext = "Oh cool! Look a Ben 10 wrist rocket! That's exactly what I wanted for Stan's birthday!"
      const encrypted = cipher.encrypt(plaintext, 22);
      const { shift, text } = cipher.crack(encrypted, CaesarCipherShiftDirection.LEFT);

      expect(text).toBe(plaintext);
      expect(shift).toBe(22);
    })

    test('Cracks another Caesar Cipher, that it didn\'t encode', () => {
      const cipher = new CaesarCipher().setShiftRight();
      const unknownMessage = "WKLV LV D VHFUHW PHVVDJH";
      const cracked = cipher.crack(unknownMessage);
      expect(cracked.text).toBe('THIS IS A SECRET MESSAGE');
      expect(cracked.shift).toBeOneOf([3, 23]); // Direction should be right shifted so in decode we left shift
    })
  })
});

import { describe, test, expect } from 'bun:test';
import CaesarCipher from './CaesarCipher.js';

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
        console.log(actual);
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
});

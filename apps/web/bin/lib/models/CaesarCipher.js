const ASCII_UPPERCASE_BASE = 65;
const ASCII_UPPERCASE_BOUND = 90;
const ASCII_LOWERCASE_BASE = 97;
const ASCII_LOWERCASE_BOUND = 122;

export const CaesarCipherShiftDirection = Object.freeze({
  LEFT: -1,
  RIGHT: 1
});

class CaesarCipher {
  #shiftDirection;

  constructor(shiftDirection = CaesarCipherShiftDirection.RIGHT) {
    this.#shiftDirection = shiftDirection;
  }

  /**
   * @summary Change the internal shift direction to right (+).
   * @returns {CaesarCipher} - The updated CaesarCipher instance
   */
  setShiftRight() {
    this.#shiftDirection = CaesarCipherShiftDirection.RIGHT;
    return this;
  }

  /**
   * @summary Change the internal shift direction to left (-).
   * @returns {CaesarCipher} - The updated CaesarCipher instance
   */
  setShiftLeft() {
    this.#shiftDirection = CaesarCipherShiftDirection.LEFT;
    return this;
  }

  /**
   * @param {string} text - The text to be encrypted
   * @param {number} shift - The number of positions to shift each character.
   * @returns {string} - The encrypted text
   */
  encrypt(text, shift) {
    let adjustedShift = this.#normalizeShift(shift);
    let encrypted = '';
    let chars = text.split('');
    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];
      let code = char.charCodeAt(0);

      if (this.#withinBounds(code, ASCII_UPPERCASE_BASE, ASCII_UPPERCASE_BOUND)) {
        encrypted += this.#shiftCharacter(char, adjustedShift, ASCII_UPPERCASE_BASE);
        continue;
      }

      if (this.#withinBounds(code, ASCII_LOWERCASE_BASE, ASCII_LOWERCASE_BOUND)) {
        encrypted += this.#shiftCharacter(char, adjustedShift, ASCII_LOWERCASE_BASE);
        continue;
      }

      encrypted += char;
    }

    return encrypted;
  }

  /**
   * @param {string} text - The text to be decrypted
   * @param {number} shift - The number of positions to shift each character.
   * @returns {string} - The decrypted text
   */
  decrypt(text, shift) {
    this.#toggleInternalShiftDirection();
    let decrypted = this.encrypt(text, shift);
    this.#toggleInternalShiftDirection();
    return decrypted;
  }

  /**
   *
   * @param {string} encryptedText
   * @param {-1 | 1} shiftDirection
   * @returns {{ text: string; shift: number }}
   */
  crack(encryptedText) {
    if (encryptedText === '') {
      return { text: '', shift: 0 };
    }

    const englishFreq = this.#getDefaultFrequencyOrderedList();

    let bestScore = Number.NEGATIVE_INFINITY;
    let bestShift = 0;
    let bestText = '';

    // Try all possible shifts
    for (let shift = 0; shift < 26; shift++) {
      const decoded = this.decrypt(encryptedText, shift);
      const score = this.#scoreText(decoded, englishFreq);

      if (score > bestScore) {
        bestScore = score;
        bestShift = shift;
        bestText = decoded;
      }
    }

    return { text: bestText, shift: bestShift };
  }

  #normalizeShift(shift) {
    return ((shift % 26) + 26) % 26;
  }

  #shiftCharacter(char, shift, base) {
    return this.#shiftDirection === CaesarCipherShiftDirection.RIGHT
      ? String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base)
      : String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
  }

  #toggleInternalShiftDirection() {
    this.#shiftDirection =
      this.#shiftDirection === CaesarCipherShiftDirection.RIGHT
        ? CaesarCipherShiftDirection.LEFT
        : CaesarCipherShiftDirection.RIGHT;
  }

  #withinBounds(code, base, bound) {
    return code >= base && code <= bound;
  }

  #scoreText(text, freqOrder) {
    // Count letter frequencies
    const counts = new Array(26).fill(0);
    let total = 0;

    for (const char of text) {
      const code = char.toLowerCase().charCodeAt(0);
      if (code >= 97 && code <= 122) {
        counts[code - 97]++;
        total++;
      }
    }

    if (total === 0) return 0;

    // Score based on expected frequency position
    let score = 0;
    for (let i = 0; i < freqOrder.length; i++) {
      const idx = freqOrder[i].charCodeAt(0) - 97;
      const expectedWeight = 1 - i / freqOrder.length;
      score += (counts[idx] / total) * expectedWeight;
    }

    return score;
  }

  #getZimFrequencyOrderedList() {
    return 'etaonrishdlfcmugypwbvkjxzq'.split('');
  }

  #getLewnardFrequencyOrderedList() {
    return 'etaoinshrdlcumwfgypbvkjxqz'.split();
  }
  #getDefaultFrequencyOrderedList() {
    return 'etaoinsrhdlucmfwypvbgkjqxz'.split('');
  }
}

export default CaesarCipher;

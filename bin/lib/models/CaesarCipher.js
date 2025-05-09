const ASCII_UPPERCASE_BASE = 65;
const ASCII_UPPERCASE_BOUND = 90;
const ASCII_LOWERCASE_BASE = 97;
const ASCII_LOWERCASE_BOUND = 122;

const CaesarCipherShiftDirection = Object.freeze({
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
      let asciiNumValue = char.charCodeAt(0);

      if (asciiNumValue >= ASCII_UPPERCASE_BASE && asciiNumValue <= ASCII_UPPERCASE_BOUND) {
        encrypted += this.#shiftCharacter(char, adjustedShift, ASCII_UPPERCASE_BASE);
        continue;
      }

      if (asciiNumValue >= ASCII_LOWERCASE_BASE && asciiNumValue <= ASCII_LOWERCASE_BOUND) {
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

  crack(encryptedText) {}

  #normalizeShift(shift) {
    return ((shift % 26) + 26) % 26;
  }

  #shiftCharacter(char, shift, base) {
    return this.#shiftDirection === CaesarCipherShiftDirection.RIGHT
      ? String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base)
      : String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
  }

  #toggleInternalShiftDirection() {
    this.#shiftDirection = this.#shiftDirection === CaesarCipherShiftDirection.RIGHT
     ? CaesarCipherShiftDirection.LEFT
      : CaesarCipherShiftDirection.RIGHT;
  }
}

export default CaesarCipher;
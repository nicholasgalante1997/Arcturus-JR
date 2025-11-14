class ASCII {
  private static getNumericCharsCodesRange(): [number, number] {
    return ['0'.charCodeAt(0), '9'.charCodeAt(0)];
  }

  static isAlphabetChar(char: string) {
    const charCode = char.charCodeAt(0);
    return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122); // A-Z or a-z
  }

  static isNumericChar(char: string) {
    const charCode = char.charCodeAt(0);
    const [lowerBound, upperBound] = this.getNumericCharsCodesRange();
    return charCode >= lowerBound && charCode <= upperBound;
  }
}

export default ASCII;

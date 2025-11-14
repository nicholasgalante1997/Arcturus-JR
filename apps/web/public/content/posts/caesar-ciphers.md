---
slug: "caesar-ciphers"
visible: true
title: "Fun with Caesar Ciphers"
---

So, maybe unpopular opinion, but Julius Caesar is without a doubt my favorite Shakespearean play. Historical Shakespeare is peak Shakespeare. The whole "Caesar was an ambitious man," soliloquy, is amidst the best if not the best. Now that we've grown culturally, let's have some fun with caesar ciphers.

## So what is a Caesar Cipher

In it's most basic form, a Caesar Cipher is an early, basic encryption method that leverages offsetting a collection of letters by a set positional shift to create an obfuscated message from a plaintext one.

Let's walk through an example.

Let's take the plaintext, **"Hello World!"**

If we want to encrypt this message, using a Caesar Cipher, and let's say a shift of 3, we would shift each alphabetic character 3 positional places (in this case, shifting _forward_),

**H -> K**  
**e -> h**  
**l -> o**  
**l -> o**  
**o -> r**  

**W -> Z**  
**o -> r**  
**r -> u**  
**l -> o**  
**d -> g**  

And we would end up with the encrypted message: Khoor Zruog

And if we knew the shift, we could easily decode this message back into "Hello World". Even if we didn't know the shift, we could very easily brute force this with trivial effort since there are only 26 positions in the english alphabet, but we'll go over a different way of brute forcing a caesar cipher later. Right now, we're just going to write some typescript pretty fast that will do this for us.

> You might be wondering at this point, _What would I use this for?_
>
> What do you normally use ancient basic encryption for? Just use it for that.

### Rot 13

In Caesar Ciphers, specifically in the english alphabet, the shift 13 serves as a special case. Since there are 26 letters in the english alphabet, shifting 13 letters is an inversion of the plaintext, and shifting 13 letters again in the same direction would _derive_ you the plaintext from the encrypted one.

`plaintext +13-> ciphertext +13-> plaintext`

## Caesar Cipher Typescript Class

> Note, we're implementing the ability to shift left (-) or shift right (+) in our Caesar Cipher class.

Alright, so let's stand up a base class here with some basic internal state corresponding to whether we're going to shift right or left in the Caesar Cipher.

We're going to set up three method stubs:

1. `encrypt(text: string, shift: number): string`
2. `decrypt(text: string, shift: number): string`
3. `crack(text: string): string[]`

They're gonna do what you think they're gonna do.

```ts
const LETTER_A_CODE_POINT = 65;
const LETTER_Z_CODE_POINT = 90;
const LETTER_a_CODE_POINT = 97;
const LETTER_z_CODE_POINT = 122;

class CaesarCipher {
    private shiftDirection: -1 | 1;

    constructor(shiftDirection = 1) {
        this.shiftDirection = shiftDirection;
    }

    setShiftLeft() {
        this.shiftDirection = -1;
    }

    setShiftRight() {
        this.shiftDirection = 1;
    }

    toggleShiftDirection() {
        this.shiftDirection = this.shiftDirection * -1;
    }

    encrypt(text, shift): string {}

    decrypt(text, shift): string {}

    crack(text): string[] {}
}
```

Let's start with setting up our `encrypt` function:

```ts
class CaesarCipher {
...
   encrypt(text: string, shift: number): string {

      /**
       * 1. Standardize the shift in case we're given a number greater than 26,
       *    We can use the modulo operator to derive a number within the 0-26 range,
       *    That we can use to offset our plaintext
       * */
      let adjustedShift = this.normalizeShift(shift);

      /**
       * 2. Create an empty string to store the encrypted char after conversion
       * */
      let encrypted = '';

      /**
       * 3. Convert the provided plaintext string into an array of chars
       * */
      let chars = text.split('');

      /**
       * 4. Loop through each character within the array
       * */
      for (let i = 0; i < chars.length; i++) {

        /**
         * 4.1 Grab the character at the current iteration index
         * */
         let char = chars[i];

         /**
          * 4.2 Convert the char into a character code (number)
          * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
          * */
         let code = char.charCodeAt(0);

        /**
         * 4.3-A handle case A, in which we are working with an UPPERCASE letter
         * */
         if (this.withinBounds(code, LETTER_A_CODE_POINT, LETTER_Z_CODE_POINT)) {
           /**
            * 4.4 Add the encrypted character to the encrypted string.
            * */
           encrypted += this.shiftCharacter(char, adjustedShift, LETTER_A_CODE_POINT);
           continue;
         }

        /**
         * 4.3-B handle case B, in which we are working with a LOWERCASE letter
         * */
         if (this.withinBounds(code, LETTER_a_CODE_POINT, LETTER_z_CODE_POINT)) {
           /**
            * 4.4 Add the encrypted character to the encrypted string.
            * */
           encrypted += this.shiftCharacter(char, adjustedShift, LETTER_a_CODE_POINT);
           continue;
         }

        /**
         * 4.3-C handle case C, in which we do not augment the character since it is not an english alphabetic character. We do not, in this case, transform numbers or special characters. 
         * 
         * (But we could).
         * */
         encrypted += char;
      }

     /**
      * 5. Return the transformed (encrypted) string
      * */
      return encrypted;
   }

   /**
    * Used to take an arbitrary number, and convert it to a number mod 26.
    * */
   private normalizeShift(shift) {
      return ((shift % 26) + 26) % 26;
   }

   /**
    * This is the bread and butter of our cipher encryption.
    * This method:
    * 1. Accepts a character, a desired positional shift, and the utf16 base numeric value for either an UPPERCASE or a LOWERCASE letter.
    * 2. Determines based on internal state whether we want to shift the position forward (+) or backwards (-)
    * 3. Creates a char code value (numeric) by shifting the char code of the plaintext character by the shift (either + or - depending on internal Cipher state), and then normalizes the result by subtracting and appending the base utf16 numeric value to the result of the operation modulo 26, giving us a valid alphabetic character code within an UPPERCASE or LOWERCASE utf16 code point range
    * 4. Create a string from the char code point value.
    * 5. Return the shifted character to the calling scope.
    * */
   private shiftCharacter(char, shift, base) {
       let shifted = this.shiftDirection === 1
         ? (((char.charCodeAt(0) - base + shift + 26) % 26) + base)
         : (((char.charCodeAt(0) - base - shift + 26) % 26) + base);

       return String.fromCharCode(shifted);
   }

   private withinBounds(code, base, bound) {
       return code >= base && code <= bound;
   }
...
}
```

There are comments in the code, but let's walk through this slowly anyway.

We start by normalizing the shift back into a number within the 0-26 range, and we do this via an internal method on the class, called `normalizeShift`. We can use the modulo operator here to convert a provided shift value into its remainder when divided by 26.

We convert a provided plaintext string into an array of characters, and loop through each character. We index each character, transform it into a char code point, and use the normalized shift to offset the character value either forward or backwards, and then convert the shifted positional value back into a character, and append it to the encrypted string.  

The cool part about setting up our class in such a way, is that our implementation of the decrypt function becomes stupidly simple, if we assume that internal state is preserved properly across encryptions and decryptions:

```ts
class CaesarCipher {
    ...

    decrypt(text: string, shift: number) {
        /**
         * 1. Flip the internal shift state
         * */
        this.toggleShiftDirection();

        /**
         * 2. Use the above encrypt method to shift the alternate positional direction
         * */
        const decrypted = this.encrypt(text, shift);

        /**  
         * 3. Shift back
         * */
        this.toggleShiftDirection();

        return decrypted;
    }

    ...
}
```

Like, come on that's so dumb.  

You might be saying, if you're observant,  

_"Well there's a bug here, couldn't you just manually shift the internal shift direction between encryption and decryption and fuck up the whole decryption method?"_

Yeah totally you could. But we can solve for that with a very trivial addition of some internal state. If we set up a field to track which direction we were in when we last encrypted, we could use that state alternatively to determine which direction we'd need to shift positionally to decrypt, asssuming the same instance is used for encryption and decryption and that the instance decrypts and encrypts in a deterministic order. If you need more flexibility, you could opt to have the shift direction become a part of the `encrypt` and `decrypt` methods themselves, so that they always use the provided direction instead of relying on internal state that may change non-deterministically within an application. You could also in your own implementation only shift in a single direction, and not cater to multiple shift directions, in which you could then unshift your ciphertext into plaintext by looping around in your shifting direction  
`(shift of 26 - (shift used to encrypt))`  
If direction is important, find a method of preserving integrity of shift direction state across encryptions and decryptions, if not, don't. With such a basic encryption method you can traverse it back, or loop around to it, ultimately achieving the same result with such a small expenditure of energy/iterations.

## Breaking the Caesar Cipher Implementation

Caesar might have been ambitious, but his cipher wasn't. We can actually take a swing at cracking the Caesar Cipher using a language analysis technique called _letter frequency analysis_, which is where we look at larger linguistic patterns to derive understandings of the probabilities of character occurrences in large enough scales. I probably did not explain that great, so here's a [shitty wikipedia article which might not help you either](https://en.wikipedia.org/wiki/Letter_frequency) (God I have a bad attitude today, what is that?!).  

> Sidebar, if you're not interested in linguistics, you are missing out broh! You can start here with a [general reading in Saussurean linguistics](https://literariness.org/2016/03/20/saussurean-structuralism/) and you can work your way up to a mature understanding that language, like almost everything else, is just a derivation of time and entropy in a system that's information preservative (needs things to happen).

So let's talk at a high level about what we're going to do here.

1. We'll start by determining a list (order is important here) of the most used characters through to the least used characters in the english alphabet
2. We'll try every possible shift against the encrypted text, giving us a shifted string based on a number between 0-26 in each loop. So we'll have 26 shifted derivations of the supplied ciphertext.  
3. We'll **score** the shifted text using our letter frequency analysis
4. We'll **assume** that the highest score, corresponds to a string of text who's letter frequency pattern is the most analagous to the list we determined in stage 1, or normalized english text.
5. We'll manually check, this one time, to make sure we didn't botch it.

<br />

```ts
class CaesarCipher {
    ...
    crack(encryptedText) {

       /**
        * Handle an edge case where the encrypted text is an empty string
        * */
       if (encryptedText === '') {
         return { text: '', shift: 0 };
       }

       /**
        * Get a frequency list from our options below
        * */
       const englishFreq = this.getDefaultFrequencyOrderedList();
*
       /**
        * Set up tracking state,
        * Iterate through each shift (26)
        * Score each iteration
        * Track the highest score*
        * 
        * *Can always adjust the logic to return multiple or all over a certain score threshold
        * */
       let bestScore = Number.NEGATIVE_INFINITY;
       let bestShift = 0;
       let bestText = '';
       
       for (let shift = 0; shift < 26; shift++) {

         const decoded = this.decrypt(encryptedText, shift);
         const score = this.scoreText(decoded, englishFreq);
         
         if (score > bestScore) {
           bestScore = score;
           bestShift = shift;
           bestText = decoded;
         }
       }
       

       return { text: bestText, shift: bestShift };
    }

    private scoreText(text: string, freqOrder: string[]) {
       /**
        * Create an array to hold each letter count (26)
        * Create a total charcount tracker
        * */
       const counts = new Array(26).fill(0);
       let total = 0;
       
       /**
        * Iterate through each char in the provided text,
        * get the current iteration's char and convert it to a char code (normalize on lower case)
        * if the char is alphabetic, get the index in the tracking array above corresponding to the current char, and then increment it's value, serving as a count
        * increment the total
        * */
       for (const char of text) {
         const code = char.toLowerCase().charCodeAt(0);
         if (code >= 97 && code <= 122) {
           counts[code - 97]++;
           total++;
         }
       }
       
       if (total === 0) return 0;
    
       let score = 0;

        /**
         * Iterate through each letter in our frequency array
         * convert the current char to a char code point offset by the base char code point value for lowercase letters (97)
         * create a proportionate weight for based on frequency,
         * this can be derived by subtracting the current iteration index / the total frequency order length from 1 to create a _front heavy_ weighting system in which chars that occur more frequently correspond to a higher score
         * increment the total score by (num of times a letter shows up / total) * weight of that char
         * 
         * And through that we can derive a score for a given decrypted string sequence,
         * 
         * that we can compare to other scores to derive a determinable "most likely solve"
         * */
       for (let i = 0; i < freqOrder.length; i++) {
         const idx = freqOrder[i].charCodeAt(0) - 97;
         const expectedWeight = 1 - (i / freqOrder.length);
         score += (counts[idx] / total) * expectedWeight;
       }
       
       return score;
    }

    private getZimFrequencyOrderedList() {
        return 'etaonrishdlfcmugypwbvkjxzq'.split('');
    }

    private getLewnardFrequencyOrderedList() {
        return 'etaoinshrdlcumwfgypbvkjxqz'.split();
    }

    private getDefaultFrequencyOrderedList() {
        return 'etaoinsrhdlucmfwypvbgkjqxz'.split('');
    }
  ...
}
```

So this is a neat way of using english letter frequency analysis to programmatically solve for the most likely derivable plaintext from a ciphertext.

Here's an example of how we can use this class:

```ts
import CaesarCipher from './CaesarCipher.js';

// Basic usage example

// Initialize the cipher (defaults to right shift)
const cipher = new CaesarCipher();

// Encrypt a message with a shift of 3
const message = "HELLO WORLD";
const encrypted = cipher.encrypt(message, 3);

console.log(`Original: ${message}`);
// Output: Original: HELLO WORLD

console.log(`Encrypted: ${encrypted}`);
// Output: Encrypted: KHOOR ZRUOG

// Decrypt the message
const decrypted = cipher.decrypt(encrypted, 3);
console.log(`Decrypted: ${decrypted}`);
// Output: Decrypted: HELLO WORLD

// Change direction and try again
cipher.setShiftLeft();
const leftShiftEncrypted = cipher.encrypt(message, 3);
console.log(`Left shift encrypted: ${leftShiftEncrypted}`);
// Output: Left shift encrypted: EBIIL TLOIA

const leftShiftDecrypted = cipher.decrypt(leftShiftEncrypted, 3);
console.log(`Left shift decrypted: ${leftShiftDecrypted}`);
// Output: Left shift decrypted: HELLO WORLD

// Automated decryption using frequency analysis
const unknownMessage = "WKLV LV D VHFUHW PHVVDJH";
const cracked = cipher.crack(unknownMessage);
console.log(`Cracked message: ${cracked.text}`);
// Output: Cracked message: THIS IS A SECRET MESSAGE

```

## Increasing the Robustness of the Caesar Cipher by Shattering SLAs

The Caesar Cipher is requisite on the key's integrity. That is, the key is a number representing a character positional shift, and it's integrity is sustained through the fact that each character in the plaintext message is offset by the same shift. That, however, makes this type of cipher extremely easy to crack, either through letter frequency analysis or just exhaustive key search.  

You can increase the robustness of messages encrypted through alphebtical character positional shifts by creating variance in the char shift key through some type of derivable determinable number sequence, but you're now breaking the Caesar Cipher contract (you're warned).  

For example, we could instead encrypt a plaintext message using a rotating shift based on prime numbers, see below:

```ts

function getListOfPrimes() {
    ...
}

let cipher = new CaesarCipher();

function encryptWithPrimeRotatingKeys(text) {
    const primes = getListOfPrimes();
    let encrypted  = '';
    let chars = text.split('');
    for (let i = 0; i < text.length; i++) {
        const char = chars[i];
        let prime = primes[i % primes.length];
        encrypted += cipher.encrypt(char, prime);
    }
    return encrypted;
}

function decryptWithPrimeRotatingKeys(text) {
    const primes = getListOfPrimes();
    let decrypted  = '';
    let chars = text.split('');
    for (let i = 0; i < text.length; i++) {
        const char = chars[i];
        let prime = primes[i % primes.length];
        decrypted += cipher.decrypt(char, prime);
    }
    return decrypted;
}

```

> I did this on the fly so if you spot check an issue, please reach out and let me know so I can correct it.

I'll probably follow this up with a post about Vigenère ciphers, which is like the logical next step, now that I'm on a pen and paper encryption kick. If you're into things like this, drop me a note. I've been passively trying to solve the COD BO3 Impossible Easter Egg, The Giant Cipher for bit and I would love some help.

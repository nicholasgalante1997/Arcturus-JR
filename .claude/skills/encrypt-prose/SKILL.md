---
name: encrypt-prose
description: Encrypt prose files using the AgnosticKeyCipher substitution pipeline so the runtime can serve ciphertext as an easter-egg page. Handles locating input files, generating keys, running .cipher/index.ts, and publishing output to public/ciphertexts/.
tags:
  - cipher
  - encryption
  - content
  - build
---

# Encrypt Prose Skill

## Overview

This skill covers the full workflow for turning plaintext prose into a published ciphertext page using the `AgnosticKeyCipher` substitution pipeline at `apps/web/.cipher/`.

The pipeline has four stages:
1. **Stage** — copy a prose file into `.cipher/plaintexts/`
2. **Key** — write a cipher key into `.cipher/keys/`
3. **Run** — invoke `.cipher/index.ts` via `bun run cipher` with env vars
4. **Publish** — copy output from `.cipher/ciphertexts/` → `public/ciphertexts/`

Prerender auto-discovers ciphers: `scripts/lib/ciphers.ts` reads `public/ciphertexts/ciphers.json`, and `scripts/lib/pages.ts` maps each slug into a static page. No manual route registration needed.

---

## Prerequisites — Directory Setup

`.cipher/plaintexts/` and `.cipher/keys/` are not committed (gitignored). Create them if absent:

```bash
mkdir -p apps/web/.cipher/plaintexts apps/web/.cipher/keys
```

---

## Step 1: Stage the Plaintext

Locate the prose file. Prose lives in `apps/web/public/content/prose/*.md`.

Copy it to `.cipher/plaintexts/<slug>.txt`. Strip markdown frontmatter if present (the cipher operates on raw text — frontmatter will be encrypted too if left in, which is usually undesirable):

```bash
# Example: stage paper-towels.md
tail -n +5 apps/web/public/content/prose/paper-towels.md \
  > apps/web/.cipher/plaintexts/paper-towels.txt
```

The filename passed to `ARC_CIPHER_INPUT` must match the basename exactly (e.g. `paper-towels.txt`).

---

## Step 2: Generate a Key

Write a key file to `apps/web/.cipher/keys/`. Three formats are supported by the loader:

### Format A — JSON substitution map (simplest)

A plain `Record<string, string | number>` covering `[a-zA-Z0-9]`. Characters absent from the map pass through unchanged.

```json
{
  "a": "m", "b": "n", "c": "o", "d": "p", "e": "q",
  "f": "r", "g": "s", "h": "t", "i": "u", "j": "v",
  "k": "w", "l": "x", "m": "y", "n": "z", "o": "a",
  "p": "b", "q": "c", "r": "d", "s": "e", "t": "f",
  "u": "g", "v": "h", "w": "i", "x": "j", "y": "k",
  "z": "l",
  "A": "M", "B": "N", "C": "O", "D": "P", "E": "Q",
  "F": "R", "G": "S", "H": "T", "I": "U", "J": "V",
  "K": "W", "L": "X", "M": "Y", "N": "Z", "O": "A",
  "P": "B", "Q": "C", "R": "D", "S": "E", "T": "F",
  "U": "G", "V": "H", "W": "I", "X": "J", "Y": "K",
  "Z": "L",
  "0": "5", "1": "6", "2": "7", "3": "8", "4": "9",
  "5": "0", "6": "1", "7": "2", "8": "3", "9": "4"
}
```

Save as `apps/web/.cipher/keys/my-key.json`. Pass `ARC_CIPHER_KEY=my-key.json`.

### Format B — TypeScript module with `{ atob, btoa }` functions (most flexible)

`atob` maps plaintext char → ciphertext char. `btoa` is its inverse.

```typescript
// apps/web/.cipher/keys/my-key.ts
const SHIFT = 7;
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = ALPHABET.toUpperCase();
const DIGITS = '0123456789';

export default {
  atob(char: string): string {
    const lower = ALPHABET.indexOf(char);
    if (lower !== -1) return ALPHABET[(lower + SHIFT) % 26];
    const upper = UPPER.indexOf(char);
    if (upper !== -1) return UPPER[(upper + SHIFT) % 26];
    const digit = DIGITS.indexOf(char);
    if (digit !== -1) return DIGITS[(digit + SHIFT) % 10];
    return char;
  },
  btoa(char: string): string {
    const lower = ALPHABET.indexOf(char);
    if (lower !== -1) return ALPHABET[(lower - SHIFT + 26) % 26];
    const upper = UPPER.indexOf(char);
    if (upper !== -1) return UPPER[(upper - SHIFT + 26) % 26];
    const digit = DIGITS.indexOf(char);
    if (digit !== -1) return DIGITS[(digit - SHIFT + 10) % 10];
    return char;
  }
};
```

Pass `ARC_CIPHER_KEY=my-key.ts`.

### Format C — TypeScript module exporting a plain substitution map

Same as Format A but as a `.ts` default export:

```typescript
// apps/web/.cipher/keys/my-key.ts
export default {
  a: 'x', b: 'y', c: 'z', A: 'X', B: 'Y', C: 'Z'
  // ... full alphabet
};
```

The loader detects the absence of `atob`/`btoa` and calls `AgnosticKeyCipher.createCipherKey(map)`.

---

## Step 3: Run the Cipher

The entrypoint is `apps/web/.cipher/index.ts`, invoked via the `cipher` npm script.

Env vars:

| Var | Required | Description |
|---|---|---|
| `ARC_CIPHER_INPUT` | yes | Filename in `.cipher/plaintexts/` (e.g. `paper-towels.txt`) |
| `ARC_CIPHER_KEY` | yes | Filename in `.cipher/keys/` (e.g. `my-key.json` or `my-key.ts`) |
| `ARC_CIPHER_SOLVENCY_NOVICE` | no | Estimated solve time for a novice (default `1hr`) |
| `ARC_CIPHER_SOLVENCY_INTERMEDIATE` | no | Estimated solve time, intermediate (default `15m`) |
| `ARC_CIPHER_SOLVENCY_EXPERT` | no | Estimated solve time, expert (default `5m`) |

Time format: `${number}${'s' | 'm' | 'h' | 'd' | 'mo'}` — e.g. `20m`, `2hr`, `45s`.

Run from `apps/web/`:

```bash
cd apps/web && \
  ARC_CIPHER_INPUT=paper-towels.txt \
  ARC_CIPHER_KEY=my-key.json \
  ARC_CIPHER_SOLVENCY_NOVICE=20m \
  ARC_CIPHER_SOLVENCY_INTERMEDIATE=5m \
  ARC_CIPHER_SOLVENCY_EXPERT=1m \
  bun run cipher
```

On success:
- Ciphertext written to `.cipher/ciphertexts/<pokemon-phrase>.txt`
- Entry appended to `.cipher/ciphers.json` with `cipher_name` (the pokemon phrase slug) and `estimated_completion_time`

The output filename is a randomly generated `<adjective>_<pokemon>.txt` from `PseudoRandomPokemonPhraseGenerator`. Note it for the next step.

---

## Step 4: Publish to Public

Copy ciphertexts and the registry from `.cipher/` into `public/ciphertexts/` so the runtime server can serve them:

```bash
cd apps/web && bun run copy:ciphers:private
```

This runs three sequential commands:
1. `mkdir -p public/ciphertexts`
2. `cp -R .cipher/ciphertexts/* public/ciphertexts/`
3. `cp .cipher/ciphers.json public/ciphertexts/ciphers.json`

After this step, the new cipher is live. The prerender process reads `public/ciphertexts/ciphers.json` → auto-registers a static page at `/ee/cipher/<slug>`.

---

## Verification

```bash
# Confirm the registry was updated
cat apps/web/public/ciphertexts/ciphers.json

# Confirm the ciphertext file exists
ls apps/web/public/ciphertexts/

# Preview the ciphertext
cat apps/web/public/ciphertexts/<slug>.txt
```

At build time, `bun run build` runs `copy:ciphers` (the public → dist copy step) as part of the pipeline, so nothing extra is needed for production.

---

## Encryption Options

The `encrypt()` method on `AgnosticKeyCipher` accepts options, but these are not exposed through the CLI entrypoint today. The default behavior is:

- **Delimiter:** space (`' '`) — plaintext is split by spaces, each word encrypted independently
- **Special chars:** pass through unchanged (punctuation, newlines, markdown syntax)
- **Output format:** `DEFAULT` — joined string, words separated by the delimiter

This means the word boundaries and punctuation structure of the prose remain visible in the ciphertext. That's intentional for an easter egg — it's solvable.

---

## Key Design Guidelines

- **Bijective mapping required:** every `atob(char)` must have a unique inverse via `btoa`. Collisions in `btoa` cause silent decryption corruption
- **Cover `[a-zA-Z0-9]`:** unmapped chars return themselves, so gaps in the key are fine — they just weaken the cipher
- **No partial maps for digits:** if you map any digit, map all 10, or leave all unmapped — partial digit coverage is confusing to read
- **Avoid identity mappings:** `{ a: 'a' }` is valid but pointless; every char that maps to itself reduces cipher strength
- **Avoid symmetric keys for interesting ciphers:** a key where `atob('a') === btoa('a')` (like ROT13) is solvable immediately by any tool

---

## Troubleshooting

**`Missing Cipher [Input, Output, CipherKey]`** — One of the env vars is unset or the file does not exist at the expected path. Confirm `plaintexts/<input>` and `keys/<keyfile>` both exist.

**`Unable to load ciphers.json`** — Both `.cipher/ciphers.json` and `public/ciphertexts/ciphers.json` are missing. Create `.cipher/ciphers.json` with an empty array `[]` to bootstrap.

**`Invalid Cipher Substitution Map`** — The JSON key file has a value that is not a string, number, or `Uint8Array`. Common mistake: `null` or boolean values in the map.

**`Unable to load cipher key`** — The `.ts` key module's default export does not match any recognized format (not a `CipherKey`, not `{ atob, btoa }`, not a plain substitution map). Check the export shape.

**Prerender hangs** — The cipher route query was not prefetched. This should not happen for cipher pages since `scripts/lib/ciphers.ts` auto-discovers from `public/ciphertexts/ciphers.json`. If it does hang, verify the `copy:ciphers:private` step ran before the prerender.

#! /usr/bin/env bun

/**
 * Bun requires that we convert a file to a module via an export to leverage top-level async
 */
export {};

import PokemonPseudoRandomPhraseGenerator from '@/models/PseudoRandomPokemonPhraseGenerator';

import { cipher, onError, onSuccess } from './utils';

import type { Duration } from './types';

const input = process.env?.ARC_CIPHER_INPUT;
const cipher_key_file = process.env?.ARC_CIPHER_KEY;
const novice: Duration = (process.env?.ARC_CIPHER_SOLVENCY_NOVICE as Duration) || '1hr';
const intermediate: Duration = (process.env?.ARC_CIPHER_SOLVENCY_INTERMEDIATE as Duration) || '15m';
const expert: Duration = (process.env?.ARC_CIPHER_SOLVENCY_EXPERT as Duration) || '5m';
const phrase = PokemonPseudoRandomPhraseGenerator.phrase();
const output = `${phrase}.txt`;
const start = performance.now();

await cipher({
  input: input!,
  cipher_keyfile: cipher_key_file!,
  output,
  estimated_completion_times: {
    novice,
    intermediate,
    expert
  }
})
  .then(() => onSuccess(start))
  .catch(onError);

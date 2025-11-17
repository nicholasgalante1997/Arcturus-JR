#!/usr/bin/env bun

import StyleDictionary from 'style-dictionary';
import config from './config';

console.log('🌌 Building Void Design Tokens...\n');

const startTime = performance.now();

try {
  const sd = new StyleDictionary(config);
  await sd.buildAllPlatforms();
  
  const endTime = performance.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('\n✨ Build complete!');
  console.log(`⏱️  Build time: ${duration}s`);
  console.log('\n📦 Output:');
  console.log('  - dist/css/void-tokens.css');
  console.log('  - dist/scss/_void-tokens.scss');
  console.log('  - dist/scss/_void-tokens-map.scss');
  console.log('  - dist/esm/tokens.js');
  console.log('  - dist/esm/tokens.d.ts');
  console.log('  - dist/json/tokens.json');
  console.log('  - dist/json/tokens-nested.json');
  console.log('  - dist/ios/VoidTokens.h');
  console.log('  - dist/ios/VoidTokens.m');
  console.log('  - dist/ios/VoidTokens.swift');
  console.log('  - dist/android/colors.xml');
  console.log('  - dist/android/dimens.xml');
  console.log('  - dist/android/font_dimens.xml');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
import fs from 'fs';
import path from 'path';

export function readMarkdownSync(file: string) {
  const input = path.isAbsolute(file) ? file : path.resolve(process.cwd(), 'public', 'content', file);
  return fs.readFileSync(input, { encoding: 'utf-8' });
}

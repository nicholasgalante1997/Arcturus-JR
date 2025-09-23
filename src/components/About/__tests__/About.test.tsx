import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import { readMarkdownSync } from '@/utils/fs';

import About from '../View';

describe('src/components/About', () => {
  test('Mounts the provided markdown to the dom', () => {
    const aboutMarkdown = readMarkdownSync('about.md');
    const { getByText } = render(<About markdown={aboutMarkdown} />);
    expect(getByText(/Amazon, Amazon Games Organization/i)).toBeInTheDocument();
  });
});

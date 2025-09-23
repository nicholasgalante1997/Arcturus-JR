import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import { readMarkdownSync } from '@/utils/fs';

import Contact from '../View';

describe('src/components/Contact', () => {
  test('Renders contact markdown content', () => {
    const mockProps = {
      markdown: readMarkdownSync('contact.md')
    };
    const { container } = render(<Contact {...mockProps} />);
    expect(container.querySelector('.markdown-content')).toBeInTheDocument();
  });
});

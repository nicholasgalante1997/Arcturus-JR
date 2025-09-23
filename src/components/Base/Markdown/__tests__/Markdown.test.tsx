import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import Markdown from '../View';

describe('src/components/Markdown', () => {
  test('Renders markdown content', () => {
    const { getByText } = render(<Markdown markdown="# Hello World" />);
    expect(getByText('Hello World')).toBeInTheDocument();
  });
});

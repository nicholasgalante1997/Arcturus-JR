import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import Home from '../View';

describe('src/components/Home', () => {
  test('Renders recent posts label', () => {
    const mockProps = {
      markdown: '# Welcome',
      posts: []
    };
    const { getByText } = render(<Home {...mockProps} />);
    expect(getByText('Recent Posts')).toBeInTheDocument();
  });
});

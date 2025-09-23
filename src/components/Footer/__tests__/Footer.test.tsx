import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import Footer from '../View';

describe('src/components/Footer', () => {
  test('Renders footer component', () => {
    const { queryByText } = render(<Footer />);
    expect(queryByText(/2025 Nick Galante/)).toBeInTheDocument();
  });
});

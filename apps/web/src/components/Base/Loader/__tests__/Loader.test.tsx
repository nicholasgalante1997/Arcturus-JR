import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import Loader from '../Loader';

describe('src/components/Loader', () => {
  test('Renders loading div', () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('.loading')).toBeInTheDocument();
  });
});

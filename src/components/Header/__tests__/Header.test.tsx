import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';
import { BrowserRouter as Router } from 'react-router';

import Header from '../View';

describe('src/components/Header', () => {
  test('Renders header component', () => {
    const { queryByText } = render(
      <Router>
        <Header />
      </Router>
    );
    expect(queryByText(/nickgalante/)).toBeInTheDocument();
    expect(queryByText(/Home/)).toBeInTheDocument();
    expect(queryByText(/Posts/)).toBeInTheDocument();
    expect(queryByText(/About/)).toBeInTheDocument();
    expect(queryByText(/Contact/)).toBeInTheDocument();
  });
});

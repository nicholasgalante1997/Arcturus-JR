import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import ErrorBoundary from '../View';

describe('src/components/ErrorBoundary', () => {
  test('Renders children when no error', () => {
    const { getByText } = render(
      <ErrorBoundary hasError={false}>
        <div>Normal content</div>
      </ErrorBoundary>
    );
    expect(getByText('Normal content')).toBeInTheDocument();
  });

  test('Renders fallback when error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary hasError={true} fallback={<div>Error occurred!</div>}>
        <div>Normal content</div>
      </ErrorBoundary>
    );
    expect(getByText('Error occurred!')).toBeInTheDocument();
  });
});

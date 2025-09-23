import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import DeferredQueryUI from '../View';

describe('src/components/DeferredQueryUI', () => {
  test('Shows placeholder when loading', () => {
    const { getByText } = render(
      <DeferredQueryUI isInFlight={true} isError={false} hasData={false} placeholder={<div>Loading...</div>}>
        <div>Content</div>
      </DeferredQueryUI>
    );
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  test('Shows content when data is available', () => {
    const { getByText } = render(
      <DeferredQueryUI isInFlight={false} isError={false} hasData={true}>
        <div>Loaded content</div>
      </DeferredQueryUI>
    );
    expect(getByText('Loaded content')).toBeInTheDocument();
  });
});

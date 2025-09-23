import React from 'react';

import { Loader } from '@/components/Base/Loader';
import { pipeline } from '@/utils/pipeline';

import DefaultErrorComponent from './components/DefaultErrorComponent';
import { DeferredQueryUIProps } from './types';
import DeferredQueryUIView from './View';

function DeferredQueryUI({
  q,
  children,
  fallback: Fallback = DefaultErrorComponent,
  placeholder = <Loader />
}: DeferredQueryUIProps) {
  const { data, error, isLoading, isPending, isError } = q;
  const isInFlight = (isLoading || isPending) && !isError;

  return (
    <DeferredQueryUIView
      isInFlight={isInFlight}
      isError={isError}
      hasData={Boolean(data)}
      error={error}
      placeholder={placeholder}
      fallback={<Fallback error={error} />}
    >
      {children}
    </DeferredQueryUIView>
  );
}

export default pipeline(React.memo)(DeferredQueryUI) as React.MemoExoticComponent<typeof DeferredQueryUI>;

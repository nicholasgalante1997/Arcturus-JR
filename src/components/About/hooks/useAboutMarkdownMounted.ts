import { UseQueryResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { MarkdownDocument } from '@/types';

export interface UseAboutMarkdownMountedOptions {
  query: UseQueryResult<MarkdownDocument, unknown>;
}

export function useAboutMarkdownMounted({ query }: UseAboutMarkdownMountedOptions) {
  const [mounted, setMounted] = useState(false);
  const { data, isFetching, isLoading, isPending, isError, error } = query;
  const isInFlight = isFetching || isLoading || isPending;
  const isInError = isError || error;
  useEffect(() => {
    if (mounted) return;
    if (isInFlight || isInError) return;
    if (data && !mounted) {
      setMounted(true);
    }
  }, [mounted, data, isInFlight, isInError]);
  return { mounted };
}

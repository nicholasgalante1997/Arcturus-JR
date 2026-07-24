import { memo } from 'react';
import { useParams } from 'react-router';

import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useGetRfc } from '@/hooks/useRfc';
import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import V2RfcDetailView from './View';

function V2RfcDetail() {
  const { rfcId } = useParams<{ rfcId: string }>();
  const rfcQuery = useGetRfc(rfcId!);

  return (
    <SuspenseEnabledQueryProvider>
      <V2RfcDetailView queries={[rfcQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(withProfiler('v2_Rfc_Detail'), memo)(V2RfcDetail);

import { memo } from 'react';

import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
import { useGetRfcs } from '@/hooks/useRfcs';
import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import V2RfcsPageView from './View';

function V2RfcsPage() {
  const rfcsQuery = useGetRfcs();

  return (
    <SuspenseEnabledQueryProvider>
      <V2RfcsPageView queries={[rfcsQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(withProfiler('v2_Rfcs_Page'), memo)(V2RfcsPage);

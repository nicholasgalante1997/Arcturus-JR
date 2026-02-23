import React from 'react';

import { V2RfcDetail as V2RfcDetailComponent } from '@/components/v2/RfcDetail';
import { default as V2AppLayout } from '@/layout/v2/AppLayout';
import { pipeline } from '@/utils/pipeline';

function V2RfcDetailPage() {
  return (
    <V2AppLayout>
      <V2RfcDetailComponent />
    </V2AppLayout>
  );
}

export default pipeline(React.memo)(V2RfcDetailPage) as React.MemoExoticComponent<typeof V2RfcDetailPage>;

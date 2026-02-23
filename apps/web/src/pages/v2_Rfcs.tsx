import React from 'react';

import { V2RfcsPage as V2RfcsPageComponent } from '@/components/v2/Rfcs';
import { default as V2AppLayout } from '@/layout/v2/AppLayout';
import { pipeline } from '@/utils/pipeline';

function V2RfcsPage() {
  return (
    <V2AppLayout>
      <V2RfcsPageComponent />
    </V2AppLayout>
  );
}

export default pipeline(React.memo)(V2RfcsPage) as React.MemoExoticComponent<typeof V2RfcsPage>;

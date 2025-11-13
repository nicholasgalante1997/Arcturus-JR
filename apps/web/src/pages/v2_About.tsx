import React from 'react';

import { V2AboutPage as V2AboutPageComponent } from '@/components/v2/About';
import { default as V2AppLayout } from '@/layout/v2/AppLayout';
import { pipeline } from '@/utils/pipeline';

function V2AboutPage() {
  return (
    <V2AppLayout>
      <V2AboutPageComponent />
    </V2AppLayout>
  );
}

export default pipeline(React.memo)(V2AboutPage) as React.MemoExoticComponent<typeof V2AboutPage>;

import React from 'react';

import { V2ContactPage as V2ContactPageComponent } from '@/components/v2/Contact';
import { default as V2AppLayout } from '@/layout/v2/AppLayout';
import { pipeline } from '@/utils/pipeline';

function V2ContactPage() {
  return (
    <V2AppLayout>
      <V2ContactPageComponent />
    </V2AppLayout>
  );
}

export default pipeline(React.memo)(V2ContactPage) as React.MemoExoticComponent<typeof V2ContactPage>;

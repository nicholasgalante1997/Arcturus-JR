import React from 'react';

import { V2HomePage as V2HomePageComponent } from '@/components/v2/Home';
import { default as V2AppLayout } from '@/layout/v2/AppLayout';
import { pipeline } from '@/utils/pipeline';

function V2HomePage() {
  return (
    <V2AppLayout>
      <V2HomePageComponent />
    </V2AppLayout>
  );
}

export default pipeline(React.memo)(V2HomePage) as React.MemoExoticComponent<typeof V2HomePage>;

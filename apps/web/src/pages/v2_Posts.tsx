import React from 'react';

import { V2PostsPage as V2PostsPageComponent } from '@/components/v2/Posts';
import { default as V2AppLayout } from '@/layout/v2/AppLayout';
import { pipeline } from '@/utils/pipeline';

function V2PostsPage() {
  return (
    <V2AppLayout>
      <V2PostsPageComponent />
    </V2AppLayout>
  );
}

export default pipeline(React.memo)(V2PostsPage) as React.MemoExoticComponent<typeof V2PostsPage>;

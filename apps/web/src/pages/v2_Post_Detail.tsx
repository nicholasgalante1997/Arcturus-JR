import React from 'react';

import { V2PostDetail as V2PostDetailComponent } from '@/components/v2/PostDetail';
import { default as V2AppLayout } from '@/layout/v2/AppLayout';
import { pipeline } from '@/utils/pipeline';

function V2PostDetailPage() {
  return (
    <V2AppLayout>
      <V2PostDetailComponent />
    </V2AppLayout>
  );
}

export default pipeline(React.memo)(V2PostDetailPage) as React.MemoExoticComponent<typeof V2PostDetailPage>;

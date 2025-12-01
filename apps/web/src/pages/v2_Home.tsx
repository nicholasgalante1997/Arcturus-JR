import React from 'react';

import { default as V2AppLayout } from '@/layout/v2/AppLayout';
import { pipeline } from '@/utils/pipeline';

function V2HomePage() {
  return <V2AppLayout>{false}</V2AppLayout>;
}

export default pipeline(React.memo)(V2HomePage) as React.MemoExoticComponent<typeof V2HomePage>;

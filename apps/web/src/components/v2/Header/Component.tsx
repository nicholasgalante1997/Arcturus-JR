import React from 'react';

import { pipeline } from '@/utils/pipeline';

import V2HeaderView from './View';

function V2Header() {
    return <V2HeaderView />
}

export default pipeline(React.memo)(V2Header) as React.MemoExoticComponent<typeof V2Header>;